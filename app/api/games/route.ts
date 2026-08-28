import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { balancedSelection } from "@/lib/game";
import { currentUser } from "@/lib/auth";
const input = z.object({ mode: z.enum(["QUICK", "YEAR", "DECADE", "CATEGORY"]).default("QUICK"), year: z.number().int().min(2000).max(new Date().getFullYear()).optional(), decade: z.number().int().optional(), category: z.string().max(60).optional() });
const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
export async function POST(request: NextRequest) {
  const parsed = input.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Choose a valid game mode." }, { status: 400 });
  const all = await db.question.findMany({ where: { status: "PUBLISHED", verified: true, ...(parsed.data.year ? { year: parsed.data.year } : {}), ...(parsed.data.category ? { category: parsed.data.category } : {}), ...(parsed.data.decade ? { year: { gte: parsed.data.decade, lte: parsed.data.decade + 9 } } : {}) }, select: { id: true, year: true, category: true, difficulty: true, question: true, questionType: true, options: true, imageUrl: true, audioUrl: true } });
  const selected = balancedSelection(all, { count: 10 });
  if (selected.length < 10) return NextResponse.json({ error: "This mode needs more approved questions. An editor can publish more from the admin queue." }, { status: 409 });
  const token = crypto.randomBytes(24).toString("base64url");
  const user = await currentUser();
  const game = await db.game.create({ data: { userId: user?.id, mode: parsed.data.mode, filterYear: parsed.data.year, filterDecade: parsed.data.decade, filterCategory: parsed.data.category, accessTokenHash: hash(token), questions: { create: selected.map((question, position) => ({ questionId: question.id, position })) } } });
  return NextResponse.json({ gameId: game.id, token, seconds: parsed.data.mode === "QUICK" ? 60 : 120, questions: selected.map(({ id, year, category, difficulty, question, questionType, options, imageUrl, audioUrl }) => ({ id, year, category, difficulty, question, questionType, options, imageUrl, audioUrl })) }, { status: 201 });
}
