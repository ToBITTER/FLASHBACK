import { describe, expect, it } from "vitest";
import { calculateIdentity } from "./identity";
import { presenterLine } from "./presenters";
describe("FLASHBACK cultural personality", () => {
  it("builds an identity from the strongest cumulative category", () => { const identity = calculateIdentity({ Music: { correct: 18, total: 20 }, Sports: { correct: 4, total: 10 } }, 16); expect(identity.title).toBe("Afrobeats Archivist"); expect(identity.level).toBe("Veteran"); });
  it("uses the general culture identity before category history exists", () => expect(calculateIdentity({}, 0).title).toBe("Gen Z Culture Scout"));
  it("gives each presenter recognisable feedback", () => { expect(presenterLine("FOOTBALL_PUNDIT", "wrong", 0)).toContain("post"); expect(presenterLine("NOLLYWOOD_AUNTY", "timeout", 0)).toContain("Director"); });
});
