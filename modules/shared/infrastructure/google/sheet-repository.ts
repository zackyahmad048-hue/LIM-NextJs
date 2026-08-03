import type { SheetSchema } from "./spreadsheet";
import { appendRow, readRows, updateRowById } from "./spreadsheet";

export abstract class SheetsBaseRepository {
  protected abstract readonly schema: SheetSchema;

  protected async readAll(): Promise<Record<string, string>[]> {
    return readRows(this.schema);
  }

  protected async createRow(data: Record<string, string>): Promise<void> {
    await appendRow(this.schema, data);
  }

  protected async updateRow(
    id: string,
    data: Record<string, string>,
  ): Promise<void> {
    await updateRowById(this.schema, id, data);
  }

  protected async findRowById(
    id: string,
  ): Promise<Record<string, string> | null> {
    const rows = await this.readAll();
    return rows.find((row) => row.id === id) ?? null;
  }

  protected toDate(value: string | undefined, fallback: Date): Date {
    if (!value) return fallback;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date;
  }

  protected toNullableDate(value: string | undefined): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  protected toNumber(value: string | undefined, fallback = 0): number {
    if (value === undefined || value === "") return fallback;
    const num = Number(value);
    return Number.isNaN(num) ? fallback : num;
  }

  protected toNullableNumber(value: string | undefined): number | null {
    if (value === undefined || value === "") return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }

  protected toNullableString(value: string | undefined): string | null {
    return value === undefined || value === "" ? null : value;
  }

  protected toDateString(date: Date | null | undefined): string {
    return date ? date.toISOString() : "";
  }

  protected toNumberString(value: number | null | undefined): string {
    return value === null || value === undefined ? "" : String(value);
  }

  protected toJsonString(value: unknown): string {
    return value === null || value === undefined ? "" : JSON.stringify(value);
  }
}
