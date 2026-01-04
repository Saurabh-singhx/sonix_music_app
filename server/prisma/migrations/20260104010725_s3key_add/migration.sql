/*
  Warnings:

  - A unique constraint covering the columns `[s3Key]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `s3Key` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "s3Key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Song_s3Key_key" ON "Song"("s3Key");
