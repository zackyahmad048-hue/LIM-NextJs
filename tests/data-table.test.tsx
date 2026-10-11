/**
 * @vitest-environment jsdom
 *
 * Kontrak DataTable (spec Tenang Modern §4): dual pagination, loading → skeleton,
 * error → DataError + retry, kosong → DataEmpty, mobile <sm → card-list.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/admin/shared/data-table";

type Row = { id: string; name: string };

const columns: ColumnDef<Row>[] = [
  { accessorKey: "name", header: "Nama", cell: ({ getValue }) => getValue<string>() },
  { id: "actions", header: () => "Aksi", cell: () => <button aria-label="Edit">Edit</button> },
];

const data: Row[] = [{ id: "1", name: "Alpha" }];

describe("<DataTable />", () => {
  beforeEach(cleanup);

  it("menampilkan state kosong saat data habis", () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getAllByText("Belum ada data").length).toBeGreaterThan(0);
  });

  it("menampilkan skeleton baris saat loading", () => {
    const { container } = render(<DataTable columns={columns} data={[]} loading />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    expect(screen.queryByText("Belum ada data")).toBeNull();
  });

  it("menampilkan state error dengan tombol coba lagi", () => {
    const onRetry = vi.fn();
    render(<DataTable columns={columns} data={[]} error onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: /coba lagi/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("menampilkan baris tabel desktop dan card-list mobile, keduanya berlabel", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByRole("table")).toBeTruthy();
    // "Nama" muncul sebagai header tabel dan sebagai label mobile card.
    expect(screen.getAllByText("Nama").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Alpha", { selector: "td" })).toBeTruthy();
  });

  it("mode client: pagination internal", () => {
    const rows = Array.from({ length: 12 }, (_, i) => ({ id: String(i), name: `Item ${i}` }));
    render(<DataTable columns={columns} data={rows} />);
    expect(screen.getAllByText("Item 0").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Item 10")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: /selanjutnya/i }));
    expect(screen.getAllByText("Item 10").length).toBeGreaterThan(0);
  });

  it("mode manualPagination: tidak memotong data dan menyemitkan perubahan halaman", () => {
    const pageSlice: Row[] = [{ id: "1", name: "Halaman 2 Alpha" }];
    const onPaginationChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={pageSlice}
        manualPagination
        pageCount={3}
        pageIndex={1}
        onPaginationChange={onPaginationChange}
      />,
    );
    expect(screen.getAllByText("Halaman 2 Alpha").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /selanjutnya/i }));
    expect(onPaginationChange).toHaveBeenCalledWith(2, 10);
  });
});
