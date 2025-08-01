-- AlterTable
ALTER TABLE "public"."HomePage" ADD COLUMN     "subHeading" TEXT;

-- CreateTable
CREATE TABLE "public"."HomePageImage" (
    "id" SERIAL NOT NULL,
    "homePageId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomePageImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."HomePageImage" ADD CONSTRAINT "HomePageImage_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "public"."HomePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
