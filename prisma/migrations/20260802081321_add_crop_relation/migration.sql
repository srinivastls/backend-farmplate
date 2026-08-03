-- CreateEnum
CREATE TYPE "ProcessingStage" AS ENUM ('RAW', 'SEMI_PROCESSED', 'PROCESSED', 'BY_PRODUCT');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('HARVESTED', 'PROCESSING', 'PACKAGED', 'IN_WAREHOUSE', 'DISPATCHED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "co2Saved" DOUBLE PRECISION,
ADD COLUMN     "cropId" TEXT,
ADD COLUMN     "marketPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "processingStage" "ProcessingStage" NOT NULL DEFAULT 'PROCESSED',
ADD COLUMN     "qualityGrade" TEXT,
ADD COLUMN     "shelfLife" INTEGER,
ADD COLUMN     "waterSaved" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Crop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarvestBatch" (
    "id" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "availableQuantity" DOUBLE PRECISION NOT NULL,
    "harvestDate" TIMESTAMP(3) NOT NULL,
    "qualityGrade" TEXT NOT NULL,
    "moisture" DOUBLE PRECISION,
    "warehouse" TEXT,
    "status" "BatchStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HarvestBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Crop_name_key" ON "Crop"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HarvestBatch_batchNumber_key" ON "HarvestBatch"("batchNumber");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestBatch" ADD CONSTRAINT "HarvestBatch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestBatch" ADD CONSTRAINT "HarvestBatch_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
