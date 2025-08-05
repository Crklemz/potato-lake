-- CreateTable
CREATE TABLE "public"."News" (
    "id" SERIAL NOT NULL,
    "newsPageId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."News" ADD CONSTRAINT "News_newsPageId_fkey" FOREIGN KEY ("newsPageId") REFERENCES "public"."NewsPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
