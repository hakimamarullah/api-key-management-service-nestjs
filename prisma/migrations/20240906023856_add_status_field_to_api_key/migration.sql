/*
  Warnings:

  - A unique constraint covering the columns `[api_key,tier_id]` on the table `api_key` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ApiKeyStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- DropIndex
DROP INDEX "api_key_api_key_owner_tier_id_key";

-- AlterTable
ALTER TABLE "api_key" ADD COLUMN     "status" "ApiKeyStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "api_key_api_key_tier_id_key" ON "api_key"("api_key", "tier_id");
