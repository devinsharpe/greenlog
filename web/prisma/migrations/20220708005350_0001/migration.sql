-- CreateEnum
CREATE TYPE "ResourceLocation" AS ENUM ('USDA', 'TROPICOS', 'TELA_BOTANICA', 'POWO', 'PLANTNET', 'GIBF', 'WIKI_EN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserForgotCode" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserForgotCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Home" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Home_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeLabel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HomeLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePlantLabel" (
    "homePlantId" INTEGER NOT NULL,
    "homeLabelId" INTEGER NOT NULL,

    CONSTRAINT "HomePlantLabel_pkey" PRIMARY KEY ("homePlantId","homeLabelId")
);

-- CreateTable
CREATE TABLE "HomeUser" (
    "userId" INTEGER NOT NULL,
    "homeId" INTEGER NOT NULL,

    CONSTRAINT "HomeUser_pkey" PRIMARY KEY ("userId","homeId")
);

-- CreateTable
CREATE TABLE "HomePlant" (
    "id" SERIAL NOT NULL,
    "homeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "trefleId" INTEGER,

    CONSTRAINT "HomePlant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "trefleId" INTEGER NOT NULL,
    "scientificName" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "genus" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "year" INTEGER,
    "commonName" TEXT,
    "familyCommonName" TEXT,
    "imageURL" TEXT,
    "flowerColor" TEXT,
    "isFlowering" BOOLEAN NOT NULL DEFAULT false,
    "foliageColor" TEXT,
    "foliageTexture" TEXT,
    "fruitColor" TEXT,
    "hasFruit" BOOLEAN NOT NULL DEFAULT false,
    "fruitMonths" INTEGER,
    "bloomMonths" TEXT,
    "groundHumidity" INTEGER NOT NULL DEFAULT -1,
    "growthForm" TEXT,
    "growthHabit" TEXT,
    "growthMonths" TEXT,
    "growthRate" TEXT,
    "ediblePart" TEXT,
    "isVegatable" BOOLEAN NOT NULL DEFAULT false,
    "isEdible" BOOLEAN NOT NULL DEFAULT false,
    "light" INTEGER NOT NULL DEFAULT -1,
    "soilNutriments" INTEGER NOT NULL DEFAULT -1,
    "soilSalinity" INTEGER NOT NULL DEFAULT -1,
    "atmosphericHumidity" INTEGER NOT NULL DEFAULT -1,
    "averageHeight" INTEGER NOT NULL DEFAULT -1,
    "maxHeight" INTEGER NOT NULL DEFAULT -1,
    "minRootDepth" INTEGER NOT NULL DEFAULT -1,
    "maxPH" INTEGER NOT NULL DEFAULT -1,
    "minPH" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantCommonNames" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "plantId" INTEGER NOT NULL,

    CONSTRAINT "PlantCommonNames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantDistributions" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "plantId" INTEGER NOT NULL,

    CONSTRAINT "PlantDistributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantResource" (
    "id" SERIAL NOT NULL,
    "location" "ResourceLocation" NOT NULL,
    "url" TEXT NOT NULL,
    "plantId" INTEGER NOT NULL,

    CONSTRAINT "PlantResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantSynonym" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "plantId" INTEGER NOT NULL,

    CONSTRAINT "PlantSynonym_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeLabel_name_key" ON "HomeLabel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Plant_trefleId_key" ON "Plant"("trefleId");

-- AddForeignKey
ALTER TABLE "UserForgotCode" ADD CONSTRAINT "UserForgotCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePlantLabel" ADD CONSTRAINT "HomePlantLabel_homeLabelId_fkey" FOREIGN KEY ("homeLabelId") REFERENCES "HomeLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePlantLabel" ADD CONSTRAINT "HomePlantLabel_homePlantId_fkey" FOREIGN KEY ("homePlantId") REFERENCES "HomePlant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeUser" ADD CONSTRAINT "HomeUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeUser" ADD CONSTRAINT "HomeUser_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePlant" ADD CONSTRAINT "HomePlant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePlant" ADD CONSTRAINT "HomePlant_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePlant" ADD CONSTRAINT "HomePlant_trefleId_fkey" FOREIGN KEY ("trefleId") REFERENCES "Plant"("trefleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantCommonNames" ADD CONSTRAINT "PlantCommonNames_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantDistributions" ADD CONSTRAINT "PlantDistributions_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantResource" ADD CONSTRAINT "PlantResource_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantSynonym" ADD CONSTRAINT "PlantSynonym_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
