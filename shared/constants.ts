// Patentes da Polícia Militar
export const PATENTES = [
  "Tenente Coronel",
  "Major",
  "Capitão",
  "1º Tenente",
  "2º Tenente",
  "Aspirante a Oficial",
  "Subtenente",
  "1º Sargento",
  "2º Sargento",
  "3º Sargento",
  "Cabo",
  "Soldado 1ª Classe",
  "Soldado 2ª Classe",
] as const;

export type Patente = (typeof PATENTES)[number];

// Prefixos de Viaturas - Será preenchido pelo usuário
// Por enquanto, deixamos como array vazio que será atualizado
export const VIATURAS: string[] = [];

export function setViaturas(viaturas: string[]) {
  VIATURAS.length = 0;
  VIATURAS.push(...viaturas);
}

export function getViaturas() {
  return [...VIATURAS];
}
