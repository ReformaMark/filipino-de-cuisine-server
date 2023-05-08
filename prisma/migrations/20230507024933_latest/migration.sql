/*
  Warnings:

  - The primary key for the `reservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `endAt` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `guestCount` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `tableId` on the `reservation` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `tables` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[paymentIntentId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `additionalNotes` to the `OnlineOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentIntentId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Reservation_tableId_idx` ON `reservation`;

-- AlterTable
ALTER TABLE `onlineorder` ADD COLUMN `additionalNotes` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reservation` DROP PRIMARY KEY,
    DROP COLUMN `endAt`,
    DROP COLUMN `guestCount`,
    DROP COLUMN `startAt`,
    DROP COLUMN `tableId`,
    ADD COLUMN `paymentIntentId` VARCHAR(27) NOT NULL,
    ADD COLUMN `paymentStatus` ENUM('Pending', 'Fulfilled') NOT NULL DEFAULT 'Pending',
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `tables`;

-- CreateTable
CREATE TABLE `ReservationSlot` (
    `startIsoDate` VARCHAR(191) NOT NULL,
    `endIsoDate` VARCHAR(191) NOT NULL,
    `reservationTableId` VARCHAR(191) NOT NULL,
    `reservationId` INTEGER NOT NULL,

    INDEX `ReservationSlot_startIsoDate_idx`(`startIsoDate`),
    INDEX `ReservationSlot_reservationTableId_idx`(`reservationTableId`),
    INDEX `ReservationSlot_reservationId_idx`(`reservationId`),
    PRIMARY KEY (`startIsoDate`, `reservationTableId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReservationTable` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Reservation_paymentIntentId_key` ON `Reservation`(`paymentIntentId`);
