-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "calendarUrl" TEXT,
ADD COLUMN     "eventType" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
