import { describe, expect, it } from "vitest";
import { balancedSelection, nostalgiaScore, scoreAnswer } from "./game";
const bank = Array.from({ length: 30 }, (_, index) => ({ id: String(index), year: 2000 + index % 5, category: ["Music", "TV", "Sports"][index % 3]!, difficulty: "MEDIUM" as const }));
describe("FLASHBACK game engine", () => {
  it("returns unique balanced questions", () => { const result = balancedSelection(bank, { count: 10 }); expect(result).toHaveLength(10); expect(new Set(result.map((q) => q.id)).size).toBe(10); expect(new Set(result.map((q) => q.category)).size).toBe(3); });
  it("honours year and history filters", () => { const result = balancedSelection(bank, { year: 2002, excludedIds: new Set(["2"]), count: 10 }); expect(result.every((q) => q.year === 2002 && q.id !== "2")).toBe(true); });
  it("keeps knowledge more valuable than speed", () => { expect(scoreAnswer("HARD", 14000, true)).toBeGreaterThan(scoreAnswer("MEDIUM", 100, true)); expect(scoreAnswer("EXPERT", 1, false)).toBe(0); });
  it("caps nostalgia at 100", () => expect(nostalgiaScore(10, 10, 5000, 10)).toBe(100));
});
