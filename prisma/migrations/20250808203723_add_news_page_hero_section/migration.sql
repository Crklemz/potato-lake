-- AlterTable
ALTER TABLE "public"."NewsPage" ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "heroTitle" TEXT NOT NULL DEFAULT 'News & Events';
