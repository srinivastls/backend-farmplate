/*
  Warnings:

  - You are about to drop the column `type` on the `TraceEvent` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `User` table. All the data in the column will be lost.
  - Added the required column `eventType` to the `TraceEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TraceEvent" DROP COLUMN "type",
ADD COLUMN     "eventType" "TraceEventType" NOT NULL,
ADD COLUMN     "handledBy" TEXT,
ADD COLUMN     "humidity" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
DROP COLUMN "photo";

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT NOT NULL,
    "actionUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TraceEvent_productId_idx" ON "TraceEvent"("productId");
