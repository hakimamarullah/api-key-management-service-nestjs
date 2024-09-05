-- CreateTable
CREATE TABLE "api_key" (
    "id" SERIAL NOT NULL,
    "api_key" VARCHAR(500) NOT NULL,
    "tier_id" INTEGER,
    "expired_at" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_key_tier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "limit" INTEGER NOT NULL DEFAULT 0,
    "ttl" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_key_tier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_key_api_key_key" ON "api_key"("api_key");

-- CreateIndex
CREATE INDEX "api_key_api_key_idx" ON "api_key"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "api_key_tier_name_key" ON "api_key_tier"("name");

-- AddForeignKey
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "api_key_tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
