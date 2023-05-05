/*
  Warnings:

  - You are about to drop the column `orderId` on the `orderitem` table. All the data in the column will be lost.
  - Added the required column `userId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `OrderItem_orderId_idx` ON `orderitem`;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `orderId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;
