/*
  Warnings:

  - You are about to drop the column `authorId` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `officer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_fkey";

-- DropIndex
DROP INDEX "posts_authorId_idx";

-- AlterTable
ALTER TABLE "officer" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "authorId";

-- CreateTable
CREATE TABLE "_PostToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PostToUser_B_index" ON "_PostToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "officer_userId_key" ON "officer"("userId");

-- AddForeignKey
ALTER TABLE "officer" ADD CONSTRAINT "officer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
