CREATE TABLE "MemoryCapsule" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "yearStart" INTEGER NOT NULL,
    "yearEnd" INTEGER,
    "description" TEXT NOT NULL,
    "coverEmoji" TEXT NOT NULL DEFAULT '📼',
    "status" TEXT NOT NULL DEFAULT 'UNLISTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MemoryCapsule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CapsuleQuestion" (
    "id" TEXT NOT NULL,
    "capsuleId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "revealStory" TEXT NOT NULL,
    "memoryYear" INTEGER,
    "mediaUrl" TEXT,
    CONSTRAINT "CapsuleQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CapsuleAttempt" (
    "id" TEXT NOT NULL,
    "capsuleId" TEXT NOT NULL,
    "userId" TEXT,
    "playerName" TEXT NOT NULL,
    "relationship" TEXT,
    "playerKey" TEXT NOT NULL,
    "accessTokenHash" TEXT NOT NULL,
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "memoryNote" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "CapsuleAttempt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MemoryCapsule_code_key" ON "MemoryCapsule"("code");
CREATE INDEX "MemoryCapsule_ownerId_createdAt_idx" ON "MemoryCapsule"("ownerId", "createdAt");
CREATE INDEX "MemoryCapsule_status_createdAt_idx" ON "MemoryCapsule"("status", "createdAt");
CREATE UNIQUE INDEX "CapsuleQuestion_capsuleId_position_key" ON "CapsuleQuestion"("capsuleId", "position");
CREATE INDEX "CapsuleAttempt_capsuleId_score_idx" ON "CapsuleAttempt"("capsuleId", "score");
CREATE INDEX "CapsuleAttempt_capsuleId_playerKey_idx" ON "CapsuleAttempt"("capsuleId", "playerKey");
ALTER TABLE "MemoryCapsule" ADD CONSTRAINT "MemoryCapsule_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CapsuleQuestion" ADD CONSTRAINT "CapsuleQuestion_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "MemoryCapsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CapsuleAttempt" ADD CONSTRAINT "CapsuleAttempt_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "MemoryCapsule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CapsuleAttempt" ADD CONSTRAINT "CapsuleAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
