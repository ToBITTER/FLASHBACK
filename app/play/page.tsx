import { PlayGame } from "@/components/play-game";
import { ModePicker } from "@/components/mode-picker";
export default async function Play({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) { const p = await searchParams; if (!p.mode) return <ModePicker />; return <PlayGame mode={p.mode} year={p.year ? Number(p.year) : undefined} decade={p.decade ? Number(p.decade) : undefined} category={p.category} />; }
