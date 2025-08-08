-- AlterTable
ALTER TABLE "public"."DnrPage" ADD COLUMN     "monitoringCtaText" TEXT DEFAULT 'Sign Up to Volunteer',
ADD COLUMN     "monitoringCtaUrl" TEXT,
ADD COLUMN     "monitoringHeading" TEXT DEFAULT 'Get Involved in Lake Monitoring',
ADD COLUMN     "monitoringImageUrl" TEXT,
ADD COLUMN     "monitoringPrograms" JSONB DEFAULT '["Water clarity readings", "Aquatic plant surveys", "Ice-out tracking"]',
ADD COLUMN     "monitoringText" TEXT DEFAULT 'Support the health of Potato Lake by participating in citizen science programs coordinated through the Wisconsin DNR. Volunteers help monitor water clarity, track invasive species, and gather valuable seasonal data like ice-out dates. No experience needed — just a love for the lake!';
