export const capsuleFormats = {
  CHILDHOOD: { label: "How well do you remember our childhood?", emoji: "🛝", hint: "Family homes, school runs, cartoons, snacks and neighbourhood gist." },
  SIBLINGS: { label: "Sibling vs sibling", emoji: "👫", hint: "Inside jokes, family rules and the stories only both of you know." },
  CLASSMATES: { label: "Old classmates reunion", emoji: "🎒", hint: "Teachers, nicknames, school slang, crushes and unforgettable days." },
  COUPLES: { label: "Our shared timeline", emoji: "💞", hint: "First meetings, favourite places, songs and relationship milestones." },
  PARENTS_CHILDREN: { label: "Parents vs children", emoji: "🏡", hint: "Two generations remembering the same family very differently." },
  DIASPORA: { label: "Nigeria vs diaspora", emoji: "✈️", hint: "What travelled with you, what changed and what still feels like home." },
  LOCAL: { label: "Only people from here remember", emoji: "📍", hint: "Street corners, local slang, schools, shops and city-specific memories." },
} as const;
export type CapsuleFormat = keyof typeof capsuleFormats;
export function capsuleScore(correct: boolean, responseMs: number): number { if (!correct) return 0; return 100 + Math.max(0, Math.round(20 * (1 - responseMs / 20000))); }
