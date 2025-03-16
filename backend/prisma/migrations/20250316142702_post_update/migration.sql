/*
  Warnings:

  - Added the required column `media_url` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "media_url" TEXT NOT NULL;
