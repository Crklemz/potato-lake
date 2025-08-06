-- AlterTable
ALTER TABLE "public"."FishingPage" ADD COLUMN     "fishingReportDate" TIMESTAMP(3),
ADD COLUMN     "fishingReportHeading" TEXT,
ADD COLUMN     "fishingReportText" TEXT;
