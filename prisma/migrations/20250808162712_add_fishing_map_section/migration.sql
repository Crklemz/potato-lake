-- AlterTable
ALTER TABLE "public"."FishingPage" ADD COLUMN     "fishingMapCaption" TEXT DEFAULT 'Explore boat landings, contour depths, and top fishing zones around Potato Lake. Updated by the Potato Lake Association.',
ADD COLUMN     "fishingMapHeading" TEXT DEFAULT 'Interactive Fishing Map',
ADD COLUMN     "fishingMapUrl" TEXT DEFAULT 'https://www.google.com/maps/d/u/0/embed?mid=1HomyPn5ahLHoOznmm4BE-0MT9CTAgjo';
