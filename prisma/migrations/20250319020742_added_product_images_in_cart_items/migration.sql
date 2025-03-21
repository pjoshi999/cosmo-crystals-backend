-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "cartItemId" UUID;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "cart_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
