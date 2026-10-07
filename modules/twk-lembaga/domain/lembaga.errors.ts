 
export class LembagaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LembagaValidationError";
  }
}
