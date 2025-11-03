-- AlterTable
ALTER TABLE "Resource" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'user_info';
ALTER TABLE "Resource" ADD COLUMN "productId" INTEGER;

-- CreateIndex
CREATE INDEX "Resource_type_idx" ON "Resource"("type");

-- CreateIndex
CREATE INDEX "Resource_productId_idx" ON "Resource"("productId");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

