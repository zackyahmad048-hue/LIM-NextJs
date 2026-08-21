export const PERMISSIONS = {
  CONTENT: {
    CATEGORY: {
      READ: "content.category.read",

      CREATE: "content.category.create",

      UPDATE: "content.category.update",

      DELETE: "content.category.delete",
    },

    POST: {
      READ: "content.post.read",

      CREATE: "content.post.create",

      UPDATE: "content.post.update",

      DELETE: "content.post.delete",

      PUBLISH: "content.post.publish",
    },
  },

  FALAK: {
    PRAYER_TIME: {
      VIEW: "falak.prayer-time.view",

      GENERATE: "falak.prayer-time.generate",
    },

    QIBLA: {
      VIEW: "falak.qibla.view",

      CALCULATE: "falak.qibla.calculate",
    },

    HIJRI: {
      VIEW: "falak.hijri.view",

      GENERATE: "falak.hijri.generate",
    },

    HISAB: {
      VIEW: "falak.hisab.view",

      CALCULATE: "falak.hisab.calculate",

      ARCHIVE: "falak.hisab.archive",
    },

    RUKYAT: {
      VIEW: "falak.rukyat.view",

      CREATE: "falak.rukyat.create",

      VERIFY: "falak.rukyat.verify",

      CONFIRM: "falak.rukyat.confirm",

      ARCHIVE: "falak.rukyat.archive",
    },

    ECLIPSE: {
      VIEW: "falak.eclipse.view",

      CALCULATE: "falak.eclipse.calculate",
    },
  },

  PROGRAM: {
    VIEW: "program.view",

    CREATE: "program.create",

    UPDATE: "program.update",

    DELETE: "program.delete",

    PUBLISH: "program.publish",

    CANCEL: "program.cancel",

    COMPLETE: "program.complete",

    ARCHIVE: "program.archive",

    SCHEDULE: {
      VIEW: "program.schedule.view",

      CREATE: "program.schedule.create",

      UPDATE: "program.schedule.update",

      DELETE: "program.schedule.delete",
    },

    COMMITTEE: {
      VIEW: "program.committee.view",

      CREATE: "program.committee.create",

      UPDATE: "program.committee.update",

      DELETE: "program.committee.delete",
    },

    PARTICIPANT: {
      VIEW: "program.participant.view",

      CREATE: "program.participant.create",

      UPDATE: "program.participant.update",

      DELETE: "program.participant.delete",
    },

    ATTENDANCE: {
      VIEW: "program.attendance.view",

      CREATE: "program.attendance.create",

      UPDATE: "program.attendance.update",

      DELETE: "program.attendance.delete",
    },

    DOCUMENTATION: {
      VIEW: "program.documentation.view",

      CREATE: "program.documentation.create",

      UPDATE: "program.documentation.update",

      DELETE: "program.documentation.delete",
    },
  },

  SECRETARIAT: {
    VIEW: "secretariat.view",

    INCOMING_MAIL: {
      VIEW: "secretariat.incoming-mail.view",

      CREATE: "secretariat.incoming-mail.create",

      UPDATE: "secretariat.incoming-mail.update",

      DELETE: "secretariat.incoming-mail.delete",
    },

    OUTGOING_MAIL: {
      VIEW: "secretariat.outgoing-mail.view",

      CREATE: "secretariat.outgoing-mail.create",

      UPDATE: "secretariat.outgoing-mail.update",

      DELETE: "secretariat.outgoing-mail.delete",

      SEND: "secretariat.outgoing-mail.send",
    },

    DISPOSITION: {
      VIEW: "secretariat.disposition.view",

      CREATE: "secretariat.disposition.create",

      UPDATE: "secretariat.disposition.update",

      DELETE: "secretariat.disposition.delete",

      COMPLETE: "secretariat.disposition.complete",
    },

    DOCUMENT: {
      VIEW: "secretariat.document.view",

      CREATE: "secretariat.document.create",

      UPDATE: "secretariat.document.update",

      DELETE: "secretariat.document.delete",

      ARCHIVE: "secretariat.document.archive",

      RESTORE: "secretariat.document.restore",
    },

    AGENDA: {
      VIEW: "secretariat.agenda.view",

      CREATE: "secretariat.agenda.create",

      UPDATE: "secretariat.agenda.update",

      DELETE: "secretariat.agenda.delete",
    },

    ARCHIVE: {
      VIEW: "secretariat.archive.view",
    },

    LETTER: {
      CREATE: "secretariat.letter.create",

      DELETE: "secretariat.letter.delete",
    },
  },

  ORGANIZATION: {
    UNIT: {
      VIEW: "organization.unit.view",

      CREATE: "organization.unit.create",

      UPDATE: "organization.unit.update",

      DELETE: "organization.unit.delete",
    },

    OFFICER: {
      VIEW: "organization.officer.view",

      CREATE: "organization.officer.create",

      UPDATE: "organization.officer.update",

      DELETE: "organization.officer.delete",
    },
  },

  TWK: {
    MEMBER: {
      VIEW: "twk.member.view",

      CREATE: "twk.member.create",

      UPDATE: "twk.member.update",

      DELETE: "twk.member.delete",

      IMPORT: "twk.member.import",

      EXPORT: "twk.member.export",
    },

    LEMBAGA: {
      VIEW: "twk.lembaga.view",
    },
  },

  CENTRAL_BOARD: {
    VIEW: "central-board.view",

    CREATE: "central-board.create",

    UPDATE: "central-board.update",

    DELETE: "central-board.delete",
  },

  REGIONAL_BOARD: {
    VIEW: "regional-board.view",

    CREATE: "regional-board.create",

    UPDATE: "regional-board.update",

    DELETE: "regional-board.delete",
  },

  BRANCH_BOARD: {
    VIEW: "branch-board.view",

    CREATE: "branch-board.create",

    UPDATE: "branch-board.update",

    DELETE: "branch-board.delete",
  },

  MEMBER: {
    VIEW: "member.view",

    CREATE: "member.create",

    UPDATE: "member.update",

    DELETE: "member.delete",
  },

  STRUCTURE: {
    VIEW: "structure.view",

    UPDATE: "structure.update",
  },

  REPORTS: {
    VIEW: "reports.view",

    SYNC: "reports.sync",
  },

  SYSTEM: {
    USER: {
      VIEW: "system.user.view",

      CREATE: "system.user.create",

      UPDATE: "system.user.update",

      DELETE: "system.user.delete",
    },

    ROLE: {
      VIEW: "system.role.view",

      CREATE: "system.role.create",

      UPDATE: "system.role.update",

      DELETE: "system.role.delete",
    },
  },
} as const;
