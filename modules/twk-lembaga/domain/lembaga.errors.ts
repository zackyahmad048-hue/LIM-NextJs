export class LembagaNotFoundError extends Error {
  constructor(id: string) {
    super(`Lembaga pemohon dengan id "${id}" tidak ditemukan.`);
    this.name = "LembagaNotFoundError";
  }
}

export class LembagaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LembagaValidationError";
  }
}
