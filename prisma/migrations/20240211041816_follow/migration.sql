-- DropIndex
DROP INDEX `Likes_commentId_fkey` ON `Likes`;

-- CreateTable
CREATE TABLE `Follow` (
    `followId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `followedId` INTEGER NULL,

    PRIMARY KEY (`followId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
