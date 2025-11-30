export const VIATURAS = {
  "TRAIL 23 HUMAITÁ": [
    "93001",
    "93002",
    "93100",
    "93200",
    "93121",
    "93122",
    "93123",
    "93157",
    "93000",
  ],
  "TRAIL 21 HUMAITÁ": [
    "93001",
    "93002",
    "93100",
    "93200",
    "93121",
    "93122",
    "93123",
    "93157",
    "93000",
  ],
  "SPIN": [
    "3-163",
    "22-858",
    "22-871",
    "22-384",
    "22-650",
    "BA-046",
    "ESSgt-020",
    "3-351",
  ],
};

export const VIATURAS_FLAT = Object.entries(VIATURAS).flatMap(([modelo, prefixos]) =>
  prefixos.map((prefixo) => `${modelo} - ${prefixo}`)
);
