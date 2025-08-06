-- CreateTable
CREATE TABLE "public"."FishingTip" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "submittedBy" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "fishingPageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FishingTip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FishingTip" ADD CONSTRAINT "FishingTip_fishingPageId_fkey" FOREIGN KEY ("fishingPageId") REFERENCES "public"."FishingPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
