export class SecretariatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecretariatError";
  }
}

export class EntityNotFoundError extends SecretariatError {
  constructor(entity: string, id: string) {
    super(`${entity} dengan ID ${id} tidak ditemukan.`);
    this.name = "EntityNotFoundError";
  }
}

export class DuplicateNumberError extends SecretariatError {
  constructor(number: string) {
    super(`Nomor dokumen ${number} sudah digunakan.`);
    this.name = "DuplicateNumberError";
  }
}

export class InvalidStatusTransitionError extends SecretariatError {
  constructor(from: string, to: string) {
    super(`Tidak dapat mengubah status dari ${from} ke ${to}.`);
    this.name = "InvalidStatusTransitionError";
  }
}

export class MailNotFoundError extends SecretariatError {
  constructor(id: string) {
    super(`Surat dengan ID ${id} tidak ditemukan.`);
    this.name = "MailNotFoundError";
  }
}

export class DispositionNotFoundError extends SecretariatError {
  constructor(id: string) {
    super(`Disposisi dengan ID ${id} tidak ditemukan.`);
    this.name = "DispositionNotFoundError";
  }
}

export class ArchiveNotFoundError extends SecretariatError {
  constructor(id: string) {
    super(`Arsip dengan ID ${id} tidak ditemukan.`);
    this.name = "ArchiveNotFoundError";
  }
}
