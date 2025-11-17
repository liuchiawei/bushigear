/*
  Warnings:

  - A unique constraint covering the columns `[checkoutSessionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "checkoutSessionId" TEXT,
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "total" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Order_checkoutSessionId_key" ON "Order"("checkoutSessionId");

-- CreateIndex
CREATE INDEX "Order_checkoutSessionId_idx" ON "Order"("checkoutSessionId");
