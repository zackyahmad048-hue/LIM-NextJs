export class ProgramError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProgramError";
  }
}

export class ProgramCodeExistsError extends ProgramError {
  constructor(code: string) {
    super(`Kode Program ${code} sudah digunakan.`);
    this.name = "ProgramCodeExistsError";
  }
}

export class ProgramNotFoundError extends ProgramError {
  constructor(id: string) {
    super(`Program dengan ID ${id} tidak ditemukan.`);
    this.name = "ProgramNotFoundError";
  }
}

export class ParticipantAlreadyRegisteredError extends ProgramError {
  constructor() {
    super("Peserta sudah terdaftar pada Program ini.");
    this.name = "ParticipantAlreadyRegisteredError";
  }
}

export class InvalidStatusTransitionError extends ProgramError {
  constructor(from: string, to: string) {
    super(`Tidak dapat mengubah status dari ${from} ke ${to}.`);
    this.name = "InvalidStatusTransitionError";
  }
}

export class ProgramNotOnGoingError extends ProgramError {
  constructor() {
    super("Program harus berstatus On Going untuk melakukan absensi.");
    this.name = "ProgramNotOnGoingError";
  }
}

export class ProgramNotCompletedError extends ProgramError {
  constructor() {
    super("Program harus berstatus Completed sebelum menerbitkan sertifikat.");
    this.name = "ProgramNotCompletedError";
  }
}
