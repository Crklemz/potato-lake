-- CreateTable
CREATE TABLE "public"."HomePage" (
    "id" SERIAL NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT,
    "heroImageUrl" TEXT,
    "introHeading" TEXT NOT NULL,
    "introText" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResortsPage" (
    "id" SERIAL NOT NULL,
    "sectionHeading" TEXT NOT NULL,
    "sectionText" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResortsPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Resort" (
    "id" SERIAL NOT NULL,
    "resortsPageId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Resort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FishingPage" (
    "id" SERIAL NOT NULL,
    "fishHeading" TEXT NOT NULL,
    "fishText" TEXT NOT NULL,
    "imageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FishingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DnrPage" (
    "id" SERIAL NOT NULL,
    "dnrHeading" TEXT NOT NULL,
    "dnrText" TEXT NOT NULL,
    "mapUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DnrPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsPage" (
    "id" SERIAL NOT NULL,
    "mainHeading" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "newsPageId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AreaServicesPage" (
    "id" SERIAL NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaServicesPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sponsor" (
    "id" SERIAL NOT NULL,
    "areaServicesPageId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "link" TEXT,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssociationPage" (
    "id" SERIAL NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "meetingNotes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssociationPage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Resort" ADD CONSTRAINT "Resort_resortsPageId_fkey" FOREIGN KEY ("resortsPageId") REFERENCES "public"."ResortsPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_newsPageId_fkey" FOREIGN KEY ("newsPageId") REFERENCES "public"."NewsPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sponsor" ADD CONSTRAINT "Sponsor_areaServicesPageId_fkey" FOREIGN KEY ("areaServicesPageId") REFERENCES "public"."AreaServicesPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
