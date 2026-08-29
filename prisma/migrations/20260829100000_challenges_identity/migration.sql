-- Evolving presenter preferences and challenge-link support.
ALTER TABLE "User" ADD COLUMN "presenter" TEXT NOT NULL DEFAULT 'LAGOS_HYPE';
ALTER TABLE "Game" ADD COLUMN "presenter" TEXT NOT NULL DEFAULT 'LAGOS_HYPE';
ALTER TABLE "Game" ADD COLUMN "participantName" TEXT;
ALTER TABLE "Game" ADD COLUMN "challengerKey" TEXT;
ALTER TABLE "Game" ADD COLUMN "challengeId" TEXT;

CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "creatorId" TEXT,
    "originalGameId" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "creatorScore" INTEGER NOT NULL,
    "creatorNostalgia" INTEGER NOT NULL,
    "bestOf" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChallengeQuestion" (
    "challengeId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "ChallengeQuestion_pkey" PRIMARY KEY ("challengeId", "questionId")
);

CREATE TABLE "ChallengeAttempt" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT,
    "challengerKey" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "nostalgia" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChallengeAttempt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Challenge_code_key" ON "Challenge"("code");
CREATE UNIQUE INDEX "Challenge_originalGameId_key" ON "Challenge"("originalGameId");
CREATE INDEX "Challenge_creatorId_createdAt_idx" ON "Challenge"("creatorId", "createdAt");
CREATE INDEX "Challenge_expiresAt_idx" ON "Challenge"("expiresAt");
CREATE UNIQUE INDEX "ChallengeQuestion_challengeId_position_key" ON "ChallengeQuestion"("challengeId", "position");
CREATE UNIQUE INDEX "ChallengeAttempt_gameId_key" ON "ChallengeAttempt"("gameId");
CREATE INDEX "ChallengeAttempt_challengeId_score_idx" ON "ChallengeAttempt"("challengeId", "score");
CREATE INDEX "ChallengeAttempt_challengeId_challengerKey_idx" ON "ChallengeAttempt"("challengeId", "challengerKey");

ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_originalGameId_fkey" FOREIGN KEY ("originalGameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Game" ADD CONSTRAINT "Game_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ChallengeQuestion" ADD CONSTRAINT "ChallengeQuestion_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChallengeQuestion" ADD CONSTRAINT "ChallengeQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChallengeAttempt" ADD CONSTRAINT "ChallengeAttempt_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChallengeAttempt" ADD CONSTRAINT "ChallengeAttempt_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChallengeAttempt" ADD CONSTRAINT "ChallengeAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
