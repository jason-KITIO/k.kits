/*
  Warnings:

  - You are about to drop the column `emailAddress` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `email` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Invitation" DROP COLUMN "emailAddress",
ADD COLUMN     "email" TEXT NOT NULL;
