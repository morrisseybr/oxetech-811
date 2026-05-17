// =============================================================================
// BLOCO 1 — Nomes e funções que se explicam sozinhos
// =============================================================================
// Prática (~10 min):
//   1) Renomeie identificadores ruins para revelar intenção.
//   2) Substitua os números mágicos (1, 2, 0.05, 0.1) por constantes nomeadas.
//   3) Quebre `calc` em funções pequenas, cada uma com uma responsabilidade.
//   4) Remova o flag argument `log` (separe cálculo de efeito colateral).
// =============================================================================

type Produto = { nome: string; valor: number; quantidade: number };
const DESCONTO_CLIENTE_1 = 0.05;
const DESCONTO_CLIENTE_2 = 0.1;

export function calc(itens: Produto[], tipoCliente: number): { total: number; desconto: number; subTotal: number } {
  const subTotal = calcSubTotal(itens);
  const desconto = descontoPorTipoCliente(subTotal, tipoCliente);
  const total = subTotal - desconto;
  
  return { total, desconto, subTotal };
}

function descontoPorTipoCliente(subTotal: number, tipoCliente: number): number {
  if (tipoCliente === 1) return subTotal * DESCONTO_CLIENTE_1;
  if (tipoCliente === 2) return subTotal * DESCONTO_CLIENTE_2;
  return 0;
}

function exibeRecibo({ subTotal, desconto, total }: { subTotal: number; desconto: number; total: number }): void {
  console.log("Subtotal: R$ " + (subTotal / 100).toFixed(2));
  console.log("Desconto: R$ " + (desconto / 100).toFixed(2));
  console.log("Total:    R$ " + (total / 100).toFixed(2));
}

function calcSubTotal(itens: Produto[]): number {
  let subTotal = 0;
  for (let i = 0; i < itens.length; i++) {
    subTotal = subTotal + itens[i].valor * itens[i].quantidade;
  }
  return subTotal;
}

const carrinho: Produto[] = [
  { nome: "Camiseta", valor: 7990, quantidade: 2 },
  { nome: "Tênis", valor: 24990, quantidade: 1 },
];

const recibo = calc(carrinho, 1);
exibeRecibo(recibo);