import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { Gamepad2, Trophy, UserRound } from "lucide-react";
import "./styles.css";
const display = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--display" });
const body = Space_Grotesk({ subsets: ["latin"], variable: "--body" });
export const metadata: Metadata = { title: "FLASHBACK — Naija Edition", description: "Let’s see if you actually remember Nigeria." };
export const viewport: Viewport = { themeColor: "#08130c", colorScheme: "dark" };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en" className={`${display.variable} ${body.variable}`}><body><header className="nav"><Link className="brand" href="/"><i>F</i>FLASH<span>BACK</span><small>NAIJA EDITION</small></Link><nav><Link href="/play"><Gamepad2 />PLAY</Link><Link href="/leaderboard"><Trophy />TABLE</Link><Link href="/account"><UserRound />PROFILE</Link></nav></header>{children}<footer><b>FLASHBACK 🇳🇬</b><span>Built for the memories we all share.</span></footer></body></html>; }
