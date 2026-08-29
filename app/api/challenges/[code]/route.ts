import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentUser, sameOrigin } from "@/lib/auth";
import { db } from "@/lib/db";
const start = z.object({ playerName: z.string().trim().min(2).max(24), playerKey: z.string().min(16).max(80), presenter: z.enum(["LAGOS_HYPE", "CALM_HISTORIAN", "FOOTBALL_PUNDIT", "NOLLYWOOD_AUNTY"]) });
const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
export async function GET(_: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.toUpperCase(), challenge = await db.challenge.findUnique({ where: { code }, include: { attempts: { orderBy: { score: "desc" } } } });
  if (!challenge || challenge.expiresAt <= new Date()) return NextResponse.json({ error: "This challenge has expired." }, { status: 404 });
  const best = new Map<string, typeof challenge.attempts[number]>(); for (const attempt of challenge.attempts) if (!best.has(attempt.challengerKey)) best.set(attempt.challengerKey, attempt);
  const leaderboard = [{ playerName: challenge.creatorName, score: challenge.creatorScore, nostalgia: challenge.creatorNostalgia, attempts: 1, creator: true }, ...[...best.values()].map((attempt) => ({ playerName: attempt.playerName, score: attempt.score, nostalgia: attempt.nostalgia, attempts: challenge.attempts.filter((item) => item.challengerKey === attempt.challengerKey).length, creator: false }))].sort((a, b) => b.score - a.score).map((row, index) => ({ ...row, rank: index + 1 }));
  return NextResponse.json({ code, creatorName: challenge.creatorName, scoreToBeat: challenge.creatorScore, nostalgiaToBeat: challenge.creatorNostalgia, bestOf: challenge.bestOf, leaderboard });
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  if (!await sameOrigin()) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const parsed = start.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Enter a player name and choose your host." }, { status: 400 });
  const code = (await params).code.toUpperCase(), challenge = await db.challenge.findUnique({ where: { code }, include: { questions: { orderBy: { position: "asc" }, include: { question: true } } } });
  if (!challenge || challenge.expiresAt <= new Date()) return NextResponse.json({ error: "This challenge has expired." }, { status: 404 });
  const attempts = await db.challengeAttempt.count({ where: { challengeId: challenge.id, challengerKey: hash(parsed.data.playerKey) } });
  if (attempts >= challenge.bestOf) return NextResponse.json({ error: "You have used all three attempts. Your best score is already on the table." }, { status: 409 });
  const token = crypto.randomBytes(24).toString("base64url"), user = await currentUser(), playerName = user?.username ?? parsed.data.playerName;
  const game = await db.game.create({ data: { userId: user?.id, mode: "QUICK", presenter: parsed.data.presenter, participantName: playerName, challengerKey: hash(parsed.data.playerKey), challengeId: challenge.id, accessTokenHash: hash(token), questions: { create: challenge.questions.map(({ questionId, position }) => ({ questionId, position })) } } });
  return NextResponse.json({ gameId: game.id, token, presenter: parsed.data.presenter, seconds: 60, attempt: attempts + 1, questions: challenge.questions.map(({ question }) => ({ id: question.id, year: question.year, category: question.category, difficulty: question.difficulty, question: question.question, questionType: question.questionType, options: question.options, imageUrl: question.imageUrl, audioUrl: question.audioUrl })) }, { status: 201 });
}
