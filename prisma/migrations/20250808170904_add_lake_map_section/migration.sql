-- AlterTable
ALTER TABLE "public"."DnrPage" ADD COLUMN     "mapCaption" TEXT DEFAULT 'View access points, water depth, and aquatic vegetation zones.',
ADD COLUMN     "mapEmbedUrl" TEXT,
ADD COLUMN     "mapExternalLinkText" TEXT DEFAULT 'View Full Bathymetric Map',
ADD COLUMN     "mapExternalLinkUrl" TEXT,
ADD COLUMN     "mapHeading" TEXT DEFAULT 'Potato Lake Map';
