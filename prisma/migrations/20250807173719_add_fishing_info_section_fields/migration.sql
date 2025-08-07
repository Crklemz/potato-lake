-- AlterTable
ALTER TABLE "public"."FishingPage" ADD COLUMN     "infoSectionHeading" TEXT,
ADD COLUMN     "infoSectionSubheading" TEXT,
ADD COLUMN     "regulationsLabel" TEXT,
ADD COLUMN     "regulationsLinkText" TEXT,
ADD COLUMN     "regulationsLinkUrl" TEXT,
ADD COLUMN     "regulationsTextNew" TEXT,
ADD COLUMN     "reportLabel" TEXT,
ADD COLUMN     "reportLastUpdated" TIMESTAMP(3),
ADD COLUMN     "reportTextNew" TEXT;
