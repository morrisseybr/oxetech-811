// =============================================================================
// BLOCO 1 — Nomes e funções que se explicam sozinhos
// =============================================================================
// Prática (~10 min):
//   1) Renomeie identificadores ruins para revelar intenção.
//   2) Substitua os números mágicos (1, 2, 0.05, 0.1) por constantes nomeadas.
//   3) Quebre `calc` em funções pequenas, cada uma com uma responsabilidade.
//   4) Remova o flag argument `log` (separe cálculo de efeito colateral).
// =============================================================================

type P = { n: string; v: number; q: number };

// Calcula o total de um carrinho aplicando desconto por tipo de cliente
// e, opcionalmente, imprime o recibo. Mistura cálculo com efeito colateral.
export function calc(itens: P[], t: number, log: boolean): number {
	let s = 0;
	for (let i = 0; i < itens.length; i++) {
		s = s + itens[i].v * itens[i].q;
	}
	let d = 0;
	if (t === 1) d = s * 0.05;
	if (t === 2) d = s * 0.1;
	const tot = s - d;
	if (log === true) {
		console.log("Subtotal: R$ " + (s / 100).toFixed(2));
		console.log("Desconto: R$ " + (d / 100).toFixed(2));
		console.log("Total:    R$ " + (tot / 100).toFixed(2));
	}
	return tot;
}

const carrinho: P[] = [
	{ n: "Camiseta", v: 7990, q: 2 },
	{ n: "Tênis", v: 24990, q: 1 },
];

calc(carrinho, 1, true);
