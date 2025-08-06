-- CreateTable
CREATE TABLE "public"."FishingGalleryImage" (
    "id" SERIAL NOT NULL,
    "fishingPageId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FishingGalleryImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FishingGalleryImage" ADD CONSTRAINT "FishingGalleryImage_fishingPageId_fkey" FOREIGN KEY ("fishingPageId") REFERENCES "public"."FishingPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
