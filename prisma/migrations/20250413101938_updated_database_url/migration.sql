/*
  Warnings:

  - You are about to drop the `newsletters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_newsletterId_fkey";

-- DropTable
DROP TABLE "newsletters";

-- CreateTable
CREATE TABLE "newsletter" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "newsletter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
