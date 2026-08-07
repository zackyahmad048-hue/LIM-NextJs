export class OrganizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationError";
  }
}

export class UnitNotFoundError extends OrganizationError {
  constructor(id: string) {
    super(`Unit organisasi ${id} tidak ditemukan.`);
    this.name = "UnitNotFoundError";
  }
}

export class DuplicateUnitCodeError extends OrganizationError {
  constructor(code: string) {
    super(`Kode unit ${code} sudah digunakan.`);
    this.name = "DuplicateUnitCodeError";
  }
}

export class InvalidParentUnitError extends OrganizationError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidParentUnitError";
  }
}

export class UnitHasChildrenError extends OrganizationError {
  constructor() {
    super("Unit masih memiliki unit bawahan. Hapus bawahan terlebih dahulu.");
    this.name = "UnitHasChildrenError";
  }
}

export class OfficerNotFoundError extends OrganizationError {
  constructor(id: string) {
    super(`Pengurus ${id} tidak ditemukan.`);
    this.name = "OfficerNotFoundError";
  }
}
