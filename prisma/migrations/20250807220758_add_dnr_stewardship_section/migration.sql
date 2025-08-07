-- AlterTable
ALTER TABLE "public"."DnrPage" ADD COLUMN     "dnrStewardshipCtaText" TEXT,
ADD COLUMN     "dnrStewardshipCtaUrl" TEXT,
ADD COLUMN     "dnrStewardshipHeading" TEXT DEFAULT 'Wisconsin DNR & Lake Stewardship',
ADD COLUMN     "dnrStewardshipText" TEXT DEFAULT 'The Wisconsin Department of Natural Resources works in partnership with local organizations like the Potato Lake Association to protect lake health and encourage responsible use. These efforts include water quality monitoring, shoreline protection, aquatic habitat restoration, and invasive species prevention.';
