/*
  Warnings:

  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
ADD COLUMN     "role" "Role" NOT NULL;
