/*
  Warnings:

  - You are about to drop the column `height` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "weight",
DROP COLUMN "width";
