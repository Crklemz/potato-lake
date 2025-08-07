-- AlterTable
ALTER TABLE "public"."DnrPage" ADD COLUMN     "dnrBoatingCardCtaText" TEXT DEFAULT 'Boating Laws & Safety',
ADD COLUMN     "dnrBoatingCardCtaUrl" TEXT DEFAULT 'https://dnr.wisconsin.gov/topic/Boat',
ADD COLUMN     "dnrBoatingCardHeading" TEXT DEFAULT 'Boating Safety',
ADD COLUMN     "dnrBoatingCardItems" JSONB DEFAULT '["Boat registration rules", "Speed limit areas", "Required safety equipment", "Invasive species prevention steps"]',
ADD COLUMN     "dnrFishingCardCtaText" TEXT DEFAULT 'Full Fishing Regulations',
ADD COLUMN     "dnrFishingCardCtaUrl" TEXT DEFAULT 'https://dnr.wisconsin.gov/topic/Fishing/regulations',
ADD COLUMN     "dnrFishingCardHeading" TEXT DEFAULT 'Fishing Regulations',
ADD COLUMN     "dnrFishingCardItems" JSONB DEFAULT '["License requirements", "Size and possession limits", "Seasonal restrictions", "Special lake-specific rules"]';
