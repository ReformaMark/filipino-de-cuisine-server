/*
  Warnings:

  - You are about to drop the column `userId` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the `dailyreservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dailyreservationitem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[paymentIntentId]` on the table `OnlineOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentIntentId` to the `OnlineOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `additionalNotes` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuItemId` to the `Sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `onlineorder` ADD COLUMN `paymentIntentId` VARCHAR(27) NOT NULL,
    MODIFY `deliveryStatus` ENUM('Pending', 'Preparing', 'OutForDelivery', 'Received', 'Cancelled') NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `order` MODIFY `paymentStatus` ENUM('Pending', 'Fulfilled') NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `userId`,
    ADD COLUMN `orderId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `additionalNotes` VARCHAR(255) NOT NULL,
    ADD COLUMN `tableId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `sales` ADD COLUMN `menuItemId` INTEGER NOT NULL,
    ADD COLUMN `orderId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `dailyreservation`;

-- DropTable
DROP TABLE `dailyreservationitem`;

-- CreateTable
CREATE TABLE `BasketItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` VARCHAR(28) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `menuItemId` INTEGER NOT NULL,

    INDEX `BasketItem_menuItemId_idx`(`menuItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tables` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tableNumber` INTEGER NOT NULL,
    `mode` ENUM('WalkIn', 'Online') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `OnlineOrder_paymentIntentId_key` ON `OnlineOrder`(`paymentIntentId`);

-- CreateIndex
CREATE INDEX `OrderItem_orderId_idx` ON `OrderItem`(`orderId`);

-- CreateIndex
CREATE INDEX `Reservation_tableId_idx` ON `Reservation`(`tableId`);

-- CreateIndex
CREATE INDEX `Sales_menuItemId_idx` ON `Sales`(`menuItemId`);

-- CreateIndex
CREATE INDEX `Sales_orderId_idx` ON `Sales`(`orderId`);
