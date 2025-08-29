/*
  Warnings:

  - You are about to drop the column `permissions` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Invitation" DROP COLUMN "permissions",
DROP COLUMN "role",
ADD COLUMN     "roleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
