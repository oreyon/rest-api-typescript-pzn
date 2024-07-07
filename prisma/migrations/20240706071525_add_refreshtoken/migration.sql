/*
  Warnings:

  - You are about to drop the column `token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `token`,
    ADD COLUMN `accessToken` VARCHAR(255) NULL,
    ADD COLUMN `refreshToken` VARCHAR(255) NULL;
