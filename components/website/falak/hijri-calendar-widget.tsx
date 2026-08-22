"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const HIJRI_MONTHS = [
  "Muharram",
  "Shafar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Zulqaidah",
  "Zulhijjah",
];

export function HijriCalendarWidget() {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [method, setMethod] = useState("HISAB");
  const [result, setResult] = useState<{
    hijriYear: number;
    hijriMonth: number;
    hijriDay: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function convert() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/v1/falak/hijri-calendar?date=${date}&method=${method}`,
      );
      const json = await res.json();
      if (json.success && json.data) {
        setResult({
          hijriYear: json.data.hijriYear,
          hijriMonth: json.data.hijriMonth,
          hijriDay: json.data.hijriDay,
        });
      } else {
        setResult(null);
        setError(
          json.message ?? "Konversi gagal. Periksa tanggal dan coba lagi.",
        );
      }
    } catch {
      setResult(null);
      setError("Tidak dapat menghubungi server konversi. Coba lagi nanti.");
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Konversi Tanggal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gregorian-date">Tanggal Masehi</Label>
            <Input
              id="gregorian-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hijri-method">Metode</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger id="hijri-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HISAB">Hisab</SelectItem>
                <SelectItem value="RUKYAT">Rukyat</SelectItem>
                <SelectItem value="IMKANUR_RUKYAT">Imkanur Rukyat</SelectItem>
                <SelectItem value="WUJUDUL_HILAL">Wujudul Hilal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={convert} disabled={loading} className="w-full">
          {loading ? "Mengkonversi..." : "Konversi"}
        </Button>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        {result && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
            <p className="text-sm text-muted-foreground">Tanggal Hijriah</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-primary">
              {result.hijriDay} {HIJRI_MONTHS[result.hijriMonth - 1]}{" "}
              {result.hijriYear} H
            </p>
            <Badge variant="outline" className="mt-3">
              {method === "HISAB" ? "Perhitungan Hisab" : `Observasi ${method}`}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
