// =============================================================================
// BLOCO 1 — Nomes e funções que se explicam sozinhos
// =============================================================================
// Prática (~10 min):
//   1) Renomeie identificadores ruins para revelar intenção.
//   2) Substitua os números mágicos (1, 2, 0.05, 0.1) por constantes nomeadas.
//   3) Quebre `calc` em funções pequenas, cada uma com uma responsabilidade.
//   4) Remova o flag argument `log` (separe cálculo de efeito colateral).
// =============================================================================

type Products = { name: string; value: number; quantity: number };

export function calculateCartTotal(
	itens: Products[],
	typeClient: number,
): number {
	const subTotal = calculateSubtotal(itens);
	const discount = calculateDiscount(typeClient, subTotal);
	const total = subTotal - discount;

	return total;
}

export function printReceipt(itens: Products[], typeClient: number): void {
	const subTotal = calculateSubtotal(itens);
	const discount = calculateDiscount(typeClient, subTotal);
	const total = subTotal - discount;

	console.log("Subtotal: " + formatToBRL(subTotal));
	console.log("Desconto: " + formatToBRL(discount));
	console.log("Total:    " + formatToBRL(total));
}

function calculateSubtotal(itens: Products[]): number {
	let subTotal = 0;
	for (let i = 0; i < itens.length; i++) {
		subTotal = subTotal + itens[i].value * itens[i].quantity;
	}
	return subTotal;
}

function calculateDiscount(typeClient: number, subTotal: number): number {
	const DISCOUNT_TYPE_1 = 0.05;
	const DISCOUNT_TYPE_2 = 0.1;

	if (typeClient === 1) return DISCOUNT_TYPE_1 * subTotal;
	if (typeClient === 2) return DISCOUNT_TYPE_2 * subTotal;
	return 0;
}

function formatToBRL(cents: number): string {
	return "R$ " + (cents / 100).toFixed(2);
}

const cart: Products[] = [
	{ name: "Camiseta", value: 7990, quantity: 2 },
	{ name: "Tênis", value: 24990, quantity: 1 },
];

printReceipt(cart, 1);
