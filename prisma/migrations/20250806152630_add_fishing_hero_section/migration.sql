-- AlterTable
ALTER TABLE "public"."FishingPage" ADD COLUMN     "ctaLink" TEXT,
ADD COLUMN     "ctaText" TEXT,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "heroTitle" TEXT NOT NULL DEFAULT 'Fishing on Potato Lake';
