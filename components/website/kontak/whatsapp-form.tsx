"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WhatsAppFormProps {
  whatsappNumber: string;
}

export default function WhatsAppForm({
  whatsappNumber,
}: WhatsAppFormProps) {
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = `Assalamu'alaikum, saya ${nama.trim() || "..."}.\n\n${pesan.trim()}`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama</Label>
        <Input
          id="nama"
          value={nama}
          onChange={(event) => setNama(event.target.value)}
          placeholder="Nama Anda"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pesan">Pesan</Label>
        <Textarea
          id="pesan"
          value={pesan}
          onChange={(event) => setPesan(event.target.value)}
          placeholder="Tulis pesan Anda..."
          rows={5}
          required
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        <Send className="h-4 w-4" />
        Kirim via WhatsApp
      </Button>
    </form>
  );
}
