/*
  Warnings:

  - You are about to drop the `Photos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Photos` DROP FOREIGN KEY `Photos_postId_fkey`;

-- AlterTable
ALTER TABLE `Posts` ADD COLUMN `photo` TEXT NULL;

-- DropTable
DROP TABLE `Photos`;
