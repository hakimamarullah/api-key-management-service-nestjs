-- AlterTable
ALTER TABLE "api_key" ADD COLUMN     "ref_id" TEXT;

COMMENT ON COLUMN "api_key"."ref_id" IS 'Reference id (You may find it as an Order ID from payment-service)';
