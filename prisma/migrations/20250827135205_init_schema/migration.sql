/*
  Warnings:

  - You are about to drop the column `permissions` on the `OrganizationMember` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `OrganizationMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."OrganizationMember" DROP COLUMN "permissions",
DROP COLUMN "role";
