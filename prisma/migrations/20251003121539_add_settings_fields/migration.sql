/*
  Warnings:

  - You are about to drop the column `maxStock` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."organizations" ADD COLUMN     "settings" JSONB;

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "maxStock";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "settings" JSONB;
