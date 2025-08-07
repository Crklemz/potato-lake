-- AlterTable
ALTER TABLE "public"."ResortsPage" ADD COLUMN     "ctaLink" TEXT,
ADD COLUMN     "ctaText" TEXT,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "heroTitle" TEXT NOT NULL DEFAULT 'Resorts & Lodging';
