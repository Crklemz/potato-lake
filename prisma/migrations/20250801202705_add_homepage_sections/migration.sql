-- AlterTable
ALTER TABLE "public"."HomePage" ADD COLUMN     "alertBanner" TEXT,
ADD COLUMN     "alertBannerActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "communityHeading" TEXT,
ADD COLUMN     "communityText" TEXT,
ADD COLUMN     "latestNewsHeading" TEXT,
ADD COLUMN     "membershipButtonText" TEXT,
ADD COLUMN     "membershipHeading" TEXT,
ADD COLUMN     "membershipText" TEXT,
ADD COLUMN     "upcomingEventsHeading" TEXT;
