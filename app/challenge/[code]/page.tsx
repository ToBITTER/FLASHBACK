import { ChallengeExperience } from "@/components/challenge-experience";
export default async function ChallengePage({ params }: { params: Promise<{ code: string }> }) { return <ChallengeExperience code={(await params).code.toUpperCase()} />; }
