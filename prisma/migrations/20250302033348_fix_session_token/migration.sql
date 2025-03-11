-- AlterTable
ALTER TABLE "password_reset_token" ALTER COLUMN "token" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "token" SET DATA TYPE TEXT;
