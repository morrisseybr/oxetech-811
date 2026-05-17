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

// Calcula o total de um carrinho aplicando desconto por tipo de cliente
// e, opcionalmente, imprime o recibo. Mistura cálculo com efeito colateral.
export function calcularValorTotal(itens: Produto[], tipoDesconto: number): number {
  const subTotal = calcularSubtotal(itens)
  const desconto = calcularDesconto(subTotal, tipoDesconto);
  const total = subTotal - desconto;
  return total;
}

function calcularSubtotal(itens: Produto[]) : number {
    let subTotal = 0;
    for (let i = 0; i < itens.length; i++) {
    subTotal = subTotal + itens[i].valor * itens[i].quantidade;
  }

  return subTotal;
}

function calcularDesconto(subTotal: number, tipoDesconto: number): number {
  if (tipoDesconto === 1) return subTotal * 0.05;
  if (tipoDesconto === 2) return subTotal * 0.1;
  return 0;
}

function imprimirRecibo(subTotal: number, desconto: number, total: number){
    console.log("Subtotal: R$ " + (subTotal / 100).toFixed(2));
    console.log("Desconto: R$ " + (desconto / 100).toFixed(2));
    console.log("Total:    R$ " + (total / 100).toFixed(2));
}

const carrinho: Produto[] = [
  { nome: "Camiseta", valor: 7990, quantidade: 2 },
  { nome: "Tênis", valor: 24990, quantidade: 1 },
];

calcularValorTotal(carrinho, 1);
