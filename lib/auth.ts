import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { db } from "./db";
const COOKIE = "flashback_session", DAYS = 30;
const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
export async function currentUser() { const token = (await cookies()).get(COOKIE)?.value; if (!token) return null; const session = await db.session.findUnique({ where: { tokenHash: hash(token) }, include: { user: true } }); if (!session || session.expiresAt <= new Date()) return null; return session.user; }
export async function createSession(userId: string) { const token = crypto.randomBytes(32).toString("base64url"); const expiresAt = new Date(Date.now() + DAYS * 86400000); await db.session.create({ data: { userId, tokenHash: hash(token), expiresAt } }); (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: expiresAt, path: "/" }); }
export async function destroySession() { const jar = await cookies(), token = jar.get(COOKIE)?.value; if (token) await db.session.deleteMany({ where: { tokenHash: hash(token) } }); jar.set(COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" }); }
export async function sameOrigin() { const h = await headers(), origin = h.get("origin"), host = h.get("x-forwarded-host") ?? h.get("host"); return !origin || (!!host && new URL(origin).host === host); }
