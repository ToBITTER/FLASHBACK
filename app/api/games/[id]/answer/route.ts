import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { nostalgiaScore, scoreAnswer } from "@/lib/game";
import { calculateIdentity, type CategoryTotals } from "@/lib/identity";
const input = z.object({ token: z.string().min(20), position: z.number().int().min(0).max(9), answer: z.string().max(300).nullable(), responseMs: z.number().int().min(0).max(120000) });
const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid answer." }, { status: 400 });
  const game = await db.game.findUnique({ where: { id: (await params).id }, include: { questions: { where: { position: parsed.data.position }, include: { question: true } } } });
  if (!game || game.accessTokenHash !== hash(parsed.data.token) || game.status !== "ACTIVE") return NextResponse.json({ error: "This game is unavailable." }, { status: 404 });
  if (game.currentIndex !== parsed.data.position) return NextResponse.json({ error: "That question was already answered." }, { status: 409 });
  const question = game.questions[0]?.question;
  if (!question) return NextResponse.json({ error: "Question unavailable." }, { status: 500 });
  const correct = parsed.data.answer === question.correctAnswer;
  const points = scoreAnswer(question.difficulty, parsed.data.responseMs, correct);
  const breakdown = (game.categoryBreakdown && typeof game.categoryBreakdown === "object" ? game.categoryBreakdown : {}) as Record<string, { correct: number; total: number }>;
  const category = breakdown[question.category] ?? { correct: 0, total: 0 };
  breakdown[question.category] = { correct: category.correct + Number(correct), total: category.total + 1 };
  const finished = parsed.data.position === 9, nextCorrect = game.correctCount + Number(correct), nextScore = game.score + points;
  const nostalgia = finished ? nostalgiaScore(nextCorrect, 10, nextScore, Object.keys(breakdown).length) : 0;
  const updated = await db.game.updateMany({ where: { id: game.id, currentIndex: parsed.data.position, status: "ACTIVE" }, data: { currentIndex: { increment: 1 }, score: { increment: points }, correctCount: { increment: correct ? 1 : 0 }, categoryBreakdown: breakdown, ...(finished ? { status: "COMPLETE", nostalgiaScore: nostalgia, completedAt: new Date() } : {}) } });
  if (!updated.count) return NextResponse.json({ error: "That question was already answered." }, { status: 409 });
  let identity = null;
  if (finished && game.userId) {
    const existing = await db.userStats.findUnique({ where: { userId: game.userId } }), cumulative = { ...((existing?.categoryScores ?? {}) as CategoryTotals) };
    for (const [name, values] of Object.entries(breakdown)) { const previous = cumulative[name] ?? { correct: 0, total: 0 }; cumulative[name] = { correct: previous.correct + values.correct, total: previous.total + values.total }; }
    const gamesPlayed = (existing?.gamesPlayed ?? 0) + 1; identity = calculateIdentity(cumulative, gamesPlayed);
    await db.userStats.upsert({ where: { userId: game.userId }, create: { userId: game.userId, totalScore: nextScore, weeklyScore: nextScore, gamesPlayed, correctAnswers: nextCorrect, categoryScores: cumulative, yearScores: {} }, update: { totalScore: { increment: nextScore }, weeklyScore: { increment: nextScore }, gamesPlayed: { increment: 1 }, correctAnswers: { increment: nextCorrect }, categoryScores: cumulative } });
    await db.questionHistory.createMany({ data: (await db.gameQuestion.findMany({ where: { gameId: game.id }, select: { questionId: true } })).map(({ questionId }) => ({ userId: game.userId!, questionId })), skipDuplicates: true });
  }
  if (finished && game.challengeId && game.challengerKey) await db.challengeAttempt.create({ data: { challengeId: game.challengeId, gameId: game.id, userId: game.userId, challengerKey: game.challengerKey, playerName: game.participantName ?? "Naija Historian", score: nextScore, correct: nextCorrect, nostalgia } });
  return NextResponse.json({ correct, correctAnswer: question.correctAnswer, explanation: question.explanation, source: question.source, points, score: nextScore, finished, result: finished ? { score: nextScore, correct: nextCorrect, nostalgia, breakdown, identity } : null });
}
