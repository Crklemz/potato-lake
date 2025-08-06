-- CreateTable
CREATE TABLE "public"."FishSpecies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "fishingPageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FishSpecies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FishSpecies" ADD CONSTRAINT "FishSpecies_fishingPageId_fkey" FOREIGN KEY ("fishingPageId") REFERENCES "public"."FishingPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
