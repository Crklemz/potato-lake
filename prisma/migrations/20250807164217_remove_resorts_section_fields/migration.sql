/*
  Warnings:

  - You are about to drop the column `sectionHeading` on the `ResortsPage` table. All the data in the column will be lost.
  - You are about to drop the column `sectionText` on the `ResortsPage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ResortsPage" DROP COLUMN "sectionHeading",
DROP COLUMN "sectionText";
