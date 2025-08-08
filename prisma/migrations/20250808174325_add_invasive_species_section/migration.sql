-- AlterTable
ALTER TABLE "public"."DnrPage" ADD COLUMN     "invasiveBody" TEXT DEFAULT 'Help protect Potato Lake from harmful invasive species like Eurasian water milfoil and zebra mussels. Learn how to prevent their spread and what to do if you spot one.',
ADD COLUMN     "invasiveHeading" TEXT DEFAULT 'Invasive Species at Potato Lake',
ADD COLUMN     "invasiveInfoUrl" TEXT DEFAULT 'https://dnr.wisconsin.gov/topic/Invasives/',
ADD COLUMN     "invasiveTips" JSONB DEFAULT '["Inspect boats and trailers before entering or leaving the lake", "Remove all aquatic plants and animals", "Drain water from equipment and live wells", "Do not release bait into the lake", "Report any suspicious plants or animals"]',
ADD COLUMN     "reportSightingUrl" TEXT DEFAULT 'https://dnr.wisconsin.gov/topic/Invasives/report.html';
