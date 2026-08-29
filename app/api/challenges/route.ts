import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentUser, sameOrigin } from "@/lib/auth";
import { db } from "@/lib/db";
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeCode = () => Array.from(crypto.randomBytes(7), (byte) => alphabet[byte % alphabet.length]).join("");
const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
const input = z.object({ gameId: z.string(), token: z.string().min(20), creatorName: z.string().trim().min(2).max(24).optional() });
export async function POST(request: NextRequest) {
  if (!await sameOrigin()) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "That finished game cannot be challenged." }, { status: 400 });
  const game = await db.game.findUnique({ where: { id: parsed.data.gameId }, include: { questions: { orderBy: { position: "asc" } }, createdChallenge: true } });
  if (!game || game.status !== "COMPLETE" || game.accessTokenHash !== hash(parsed.data.token)) return NextResponse.json({ error: "Complete the game before creating a challenge." }, { status: 409 });
  if (game.createdChallenge) return NextResponse.json({ code: game.createdChallenge.code });
  const user = await currentUser(), creatorName = user?.username ?? parsed.data.creatorName ?? "Naija Historian";
  for (let attempt = 0; attempt < 8; attempt++) {
    try { const challenge = await db.challenge.create({ data: { code: makeCode(), creatorId: user?.id, originalGameId: game.id, creatorName, creatorScore: game.score, creatorNostalgia: game.nostalgiaScore, expiresAt: new Date(Date.now() + 30 * 86400000), questions: { create: game.questions.map(({ questionId, position }) => ({ questionId, position })) } } }); return NextResponse.json({ code: challenge.code }, { status: 201 }); } catch { /* retry the rare code collision */ }
  }
  return NextResponse.json({ error: "Could not create the challenge." }, { status: 500 });
}
