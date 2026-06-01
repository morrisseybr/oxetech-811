// =============================================================================
// BLOCO 1 — Nomes e funções que se explicam sozinhos (REFATORADO)
// =============================================================================
// Aplicado:
//   - Nomes revelando intenção (Item/TipoCliente, calcularTotal/imprimirRecibo).
//   - Tipo de cliente nomeado por união de strings (sem números mágicos 1/2).
//   - Constantes para os percentuais de desconto.
//   - Funções pequenas, uma responsabilidade cada (stepdown rule).
//   - Sem flag argument: cálculo e impressão são funções separadas.
// =============================================================================

type Item = { nome: string; precoCentavos: number; quantidade: number };
type TipoCliente = "comum" | "premium" | "vip";

const DESCONTO_POR_TIPO: Record<TipoCliente, number> = {
	comum: 0,
	premium: 0.05,
	vip: 0.1,
};

export function calcularTotal(itens: Item[], tipo: TipoCliente): number {
	const subtotal = calcularSubtotal(itens);
	const desconto = subtotal * DESCONTO_POR_TIPO[tipo];
	return subtotal - desconto;
}

export function imprimirRecibo(itens: Item[], tipo: TipoCliente): void {
	const subtotal = calcularSubtotal(itens);
	const desconto = subtotal * DESCONTO_POR_TIPO[tipo];
	const total = subtotal - desconto;
	console.log("Subtotal: " + formatarReais(subtotal));
	console.log("Desconto: " + formatarReais(desconto));
	console.log("Total:    " + formatarReais(total));
}

function calcularSubtotal(itens: Item[]): number {
	return itens.reduce(
		(soma, item) => soma + item.precoCentavos * item.quantidade,
		0,
	);
}

function formatarReais(centavos: number): string {
	return "R$ " + (centavos / 100).toFixed(2);
}

const carrinho: Item[] = [
	{ nome: "Camiseta", precoCentavos: 7990, quantidade: 2 },
	{ nome: "Tênis", precoCentavos: 24990, quantidade: 1 },
];

imprimirRecibo(carrinho, "premium");
