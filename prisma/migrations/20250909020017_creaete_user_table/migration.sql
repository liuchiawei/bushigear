/*
  Warnings:

  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - Added the required column `description_cn` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_en` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_jp` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_cn` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_jp` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE "public".product_id_seq;
ALTER TABLE "public"."Product" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "description_cn" TEXT NOT NULL,
ADD COLUMN     "description_en" TEXT NOT NULL,
ADD COLUMN     "description_jp" TEXT NOT NULL,
ADD COLUMN     "name_cn" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_jp" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('"public".product_id_seq');
ALTER SEQUENCE "public".product_id_seq OWNED BY "public"."Product"."id";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
