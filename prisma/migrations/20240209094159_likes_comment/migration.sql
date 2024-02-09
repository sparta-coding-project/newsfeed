-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `Likes_commentId_fkey`;

-- AlterTable
ALTER TABLE `Likes` MODIFY `commentId` INTEGER NULL;
