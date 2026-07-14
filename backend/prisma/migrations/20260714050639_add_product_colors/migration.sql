/*
  Warnings:

  - You are about to drop the column `color` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `ProductVariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,colorId,size]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `colorId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."ProductVariant_productId_idx";

-- DropIndex
DROP INDEX "public"."ProductVariant_productId_size_color_key";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "color",
DROP COLUMN "imageUrl",
ADD COLUMN     "colorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProductColor" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductColor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductColor_productId_color_key" ON "ProductColor"("productId", "color");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_colorId_size_key" ON "ProductVariant"("productId", "colorId", "size");

-- AddForeignKey
ALTER TABLE "ProductColor" ADD CONSTRAINT "ProductColor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "ProductColor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
