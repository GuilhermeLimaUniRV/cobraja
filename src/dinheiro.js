// Valores em dinheiro: guardados em centavos (inteiro), devolvidos como texto com 2 casas (spec 001, D-10).

const MAXIMO_EM_CENTAVOS = 100000_00;

// RN-01: devolve os centavos, ou null se o valor não for aceito.
export function paraCentavos(valor) {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) return null;
  const centavos = Math.round(valor * 100);
  if (Math.abs(valor * 100 - centavos) > 1e-6) return null; // mais de 2 casas decimais
  if (centavos <= 0 || centavos > MAXIMO_EM_CENTAVOS) return null;
  return centavos;
}

export function paraTexto(centavos) {
  return (centavos / 100).toFixed(2);
}
