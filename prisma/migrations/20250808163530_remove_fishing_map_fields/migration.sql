/*
  Warnings:

  - You are about to drop the column `fishingMapCaption` on the `FishingPage` table. All the data in the column will be lost.
  - You are about to drop the column `fishingMapHeading` on the `FishingPage` table. All the data in the column will be lost.
  - You are about to drop the column `fishingMapUrl` on the `FishingPage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."FishingPage" DROP COLUMN "fishingMapCaption",
DROP COLUMN "fishingMapHeading",
DROP COLUMN "fishingMapUrl";
