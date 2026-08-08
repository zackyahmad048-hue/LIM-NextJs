-- CreateIndex
CREATE INDEX "outgoing_mail_createdAt_idx" ON "outgoing_mail"("createdAt");

-- CreateIndex
CREATE INDEX "outgoing_mail_approvedAt_idx" ON "outgoing_mail"("approvedAt");

-- CreateIndex
CREATE INDEX "outgoing_mail_archivedAt_idx" ON "outgoing_mail"("archivedAt");
