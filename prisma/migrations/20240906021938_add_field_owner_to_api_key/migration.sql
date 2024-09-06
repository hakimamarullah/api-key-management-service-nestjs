/*
  Warnings:

  - A unique constraint covering the columns `[api_key,owner,tier_id]` on the table `api_key` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner` to the `api_key` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "api_key_api_key_key";

-- AlterTable
ALTER TABLE "api_key" ADD COLUMN     "owner" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "api_key_api_key_owner_tier_id_key" ON "api_key"("api_key", "owner", "tier_id");
