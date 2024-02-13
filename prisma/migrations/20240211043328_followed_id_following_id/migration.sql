/*
  Warnings:

  - You are about to drop the column `followedId` on the `Follow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Follow` DROP COLUMN `followedId`,
    ADD COLUMN `followingId` INTEGER NULL;
