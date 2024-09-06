-- AlterEnum
ALTER TYPE "ApiKeyStatus" ADD VALUE 'REPLACED';

-- AlterTable
ALTER TABLE "api_key_tier" ADD COLUMN     "description" VARCHAR(500);
