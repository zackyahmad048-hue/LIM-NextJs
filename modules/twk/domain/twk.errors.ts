export class TwkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TwkError";
  }
}

export class MemberNotFoundError extends TwkError {
  constructor(id: string) {
    super(`Anggota dengan ID ${id} tidak ditemukan.`);
    this.name = "MemberNotFoundError";
  }
}
