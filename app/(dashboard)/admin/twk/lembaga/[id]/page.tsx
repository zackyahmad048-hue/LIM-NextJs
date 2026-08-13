import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { Button } from "@/components/ui/button";

import { getLembagaById } from "@/modules/twk-lembaga/queries/lembaga.query";
import {
  LOKASI_MADRASAH_LABELS,
  SATUAN_PENDIDIKAN_LABELS,
  STATUS_PEMOHON_LABELS,
} from "@/modules/twk-lembaga/domain/entities";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase text-muted-foreground">
        {label}
      </p>
      <p className="text-sm">
        {value && value.trim() ? (
          value
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </p>
    </div>
  );
}

function FieldList({ label, values }: { label: string; values: string[] }) {
  const trimmed = (values ?? []).filter((value) => value.trim().length > 0);
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase text-muted-foreground">
        {label}
      </p>
      {trimmed.length === 0 ? (
        <p className="text-sm text-muted-foreground">-</p>
      ) : (
        <ul className="space-y-0.5 text-sm">
          {trimmed.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PhotoField({
  label,
  fileId,
}: {
  label: string;
  fileId: string | null;
}) {
  if (!fileId) {
    return <Field label={label} value={null} />;
  }
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase text-muted-foreground">
        {label}
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/media/${encodeURIComponent(fileId)}`}
        alt={label}
        className="mt-1 h-24 w-20 rounded-md border object-cover"
      />
    </div>
  );
}

export default async function LembagaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lembaga = await getLembagaById(id);

  if (!lembaga) notFound();

  const alamat = [lembaga.rtRw, lembaga.desaKelurahan, lembaga.kecamatan]
    .filter(Boolean)
    .join(", ");
  const wilayah = [lembaga.kabupatenKota, lembaga.provinsi]
    .filter(Boolean)
    .join(", ");

  return (
    <PageContainer>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/twk/lembaga">
            <ArrowLeft className="size-4" />
            Kembali ke daftar
          </Link>
        </Button>
      </div>

      <PageHeader
        title={lembaga.namaLembagaPendidikan}
        description={wilayah || undefined}
      />

      <div className="mt-6 space-y-4">
        <SectionCard className="space-y-6">
          <h2 className="text-base font-semibold">Identitas Lembaga</h2>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field
              label="Nama Lembaga Pendidikan"
              value={lembaga.namaLembagaPendidikan}
            />
            <Field label="RT/RW" value={lembaga.rtRw} />
            <Field label="Alamat" value={alamat} />
            <Field label="Wilayah" value={wilayah} />
            <Field label="Nomor Telepon" value={lembaga.teleponLembaga} />
            <Field
              label="Akun Media Sosial"
              value={lembaga.mediaSosialLembaga}
            />
          </div>
        </SectionCard>

        <SectionCard className="space-y-6">
          <h2 className="text-base font-semibold">Identitas Pengasuh</h2>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field label="Nama Pengasuh" value={lembaga.pengasuhNama} />
            <Field
              label="Status Pengasuh"
              value={
                lembaga.pengasuhStatus
                  ? STATUS_PEMOHON_LABELS[lembaga.pengasuhStatus]
                  : null
              }
            />
            <Field
              label="Status Lainnya"
              value={lembaga.pengasuhStatusLainnya}
            />
            <Field
              label="Alumni Angkatan"
              value={lembaga.pengasuhAlumniAngkatan}
            />
            <Field label="Nomor Telepon" value={lembaga.pengasuhTelepon} />
            <PhotoField label="Foto" fileId={lembaga.pengasuhFotoFileId} />
          </div>
        </SectionCard>

        <SectionCard className="space-y-6">
          <h2 className="text-base font-semibold">
            Identitas Penanggung Jawab
          </h2>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field
              label="Nama Penanggung Jawab"
              value={lembaga.penanggungJawabNama}
            />
            <Field
              label="Status Penanggung Jawab"
              value={
                lembaga.penanggungJawabStatus
                  ? STATUS_PEMOHON_LABELS[lembaga.penanggungJawabStatus]
                  : null
              }
            />
            <Field
              label="Status Lainnya"
              value={lembaga.penanggungJawabStatusLainnya}
            />
            <Field
              label="Alumni Angkatan"
              value={lembaga.penanggungJawabAlumniAngkatan}
            />
            <Field
              label="Nomor Telepon"
              value={lembaga.penanggungJawabTelepon}
            />
            <PhotoField
              label="Foto"
              fileId={lembaga.penanggungJawabFotoFileId}
            />
          </div>
        </SectionCard>

        <SectionCard className="space-y-6">
          <h2 className="text-base font-semibold">Kondisi Lembaga</h2>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field
              label="Lokasi Madrasah"
              value={
                lembaga.lokasiMadrasah
                  ? LOKASI_MADRASAH_LABELS[lembaga.lokasiMadrasah]
                  : null
              }
            />
            <Field
              label="Jenis Satuan Pendidikan"
              value={
                lembaga.jenisSatuanPendidikan
                  ? SATUAN_PENDIDIKAN_LABELS[lembaga.jenisSatuanPendidikan]
                  : null
              }
            />
            <Field
              label="Jenis Satuan Lainnya"
              value={lembaga.jenisSatuanPendidikanLainnya}
            />
            <FieldList label="Kitab Bermakna" values={lembaga.kitabBermakna} />
            <Field
              label="Kitab Bermakna Lainnya"
              value={lembaga.kitabBermaknaLainnya}
            />
            <FieldList
              label="Bahasa Pengantar"
              values={lembaga.bahasaPengantar}
            />
            <Field
              label="Bahasa Pengantar Lainnya"
              value={lembaga.bahasaPengantarLainnya}
            />
            <Field
              label="Jumlah Pengurus (Putra)"
              value={
                lembaga.jumlahPengurusPutra !== null &&
                lembaga.jumlahPengurusPutra !== undefined
                  ? String(lembaga.jumlahPengurusPutra)
                  : null
              }
            />
            <Field
              label="Jumlah Pengurus (Putri)"
              value={
                lembaga.jumlahPengurusPutri !== null &&
                lembaga.jumlahPengurusPutri !== undefined
                  ? String(lembaga.jumlahPengurusPutri)
                  : null
              }
            />
            <Field
              label="Jumlah Santri (Putra)"
              value={
                lembaga.jumlahSantriPutra !== null &&
                lembaga.jumlahSantriPutra !== undefined
                  ? String(lembaga.jumlahSantriPutra)
                  : null
              }
            />
            <Field
              label="Jumlah Santri (Putri)"
              value={
                lembaga.jumlahSantriPutri !== null &&
                lembaga.jumlahSantriPutri !== undefined
                  ? String(lembaga.jumlahSantriPutri)
                  : null
              }
            />
          </div>
        </SectionCard>

        <SectionCard className="space-y-6">
          <h2 className="text-base font-semibold">Permohonan Guru Bantu</h2>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field
              label="Jumlah Guru Bantu Dimohon"
              value={String(lembaga.jumlahGuruBantuDimohon)}
            />
            <Field label="Tugas Guru Bantu" value={lembaga.tugasGuruBantu} />
            <Field
              label="Kitab yang Diajarkan"
              value={lembaga.kitabDiajarkanGuruBantu}
            />
            <div className="sm:col-span-2">
              <Field label="Catatan" value={lembaga.catatanCalonGuruBantu} />
            </div>
            {lembaga.dokumenPermohonanFileId && (
              <div className="sm:col-span-2">
                <p className="text-xs uppercase text-muted-foreground">
                  Dokumen Permohonan
                </p>
                <Button variant="outline" size="sm" asChild className="mt-1">
                  <a
                    href={`/api/media/${encodeURIComponent(lembaga.dokumenPermohonanFileId)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="size-4" />
                    Unduh dokumen
                  </a>
                </Button>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
