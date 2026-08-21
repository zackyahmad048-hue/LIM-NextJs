import { describe, expect, it } from "vitest";

import { buildSignerMap } from "./organization.query";

describe("buildSignerMap", () => {
  const rows = [
    {
      unitCode: "PP",
      officer: { name: "Ahmad", position: "Ketua Umum", isLeader: true },
    },
    {
      unitCode: "PP",
      officer: {
        name: "Budi",
        position: "Wakil Ketua",
        isLeader: false,
      },
    },
    {
      unitCode: "PP",
      officer: {
        name: "Citra",
        position: "Sekretaris Umum",
        isLeader: false,
      },
    },
    {
      unitCode: "PW-JABAR",
      officer: {
        name: "Dedi",
        position: "Sekretaris",
        isLeader: true,
      },
    },
  ];

  it("memilih ketua dari pengurus pemimpin (isLeader)", () => {
    const map = buildSignerMap(["PP"], rows);
    expect(map.PP.ketua).toEqual({
      name: "Ahmad",
      position: "Ketua Umum",
    });
  });

  it("memilih sekretaris dari posisi yang mengandung 'Sekretaris'", () => {
    const map = buildSignerMap(["PP"], rows);
    expect(map.PP.sekretaris).toEqual({
      name: "Citra",
      position: "Sekretaris Umum",
    });
  });

  it("mengisi null bila tidak ada kandidat", () => {
    const map = buildSignerMap(["PC-TEST"], rows);
    expect(map["PC-TEST"]).toEqual({ ketua: null, sekretaris: null });
  });

  it("mengabaikan pengurus dari unit yang tidak diminta", () => {
    const map = buildSignerMap(["PP"], rows);
    expect(map["PW-JABAR"]).toBeUndefined();
  });

  it("tidak menimpa ketua dengan pengurus non-pemimpin", () => {
    const map = buildSignerMap(["PP"], rows);
    expect(map.PP.ketua?.name).toBe("Ahmad");
  });
});
