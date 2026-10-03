-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('INVITATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "InvitationToken" RENAME TO "UserToken";

-- Rename Constraints & Indexes
ALTER TABLE "UserToken" RENAME CONSTRAINT "InvitationToken_pkey" TO "UserToken_pkey";
ALTER INDEX "InvitationToken_token_key" RENAME TO "UserToken_token_key";
ALTER INDEX "InvitationToken_userId_idx" RENAME TO "UserToken_userId_idx";
ALTER TABLE "UserToken" RENAME CONSTRAINT "InvitationToken_userId_fkey" TO "UserToken_userId_fkey";

-- Add Columns
ALTER TABLE "UserToken" ADD COLUMN "purpose" "TokenPurpose" NOT NULL DEFAULT 'INVITATION';
ALTER TABLE "UserToken" ADD COLUMN "attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "UserToken" ALTER COLUMN "purpose" DROP DEFAULT;
