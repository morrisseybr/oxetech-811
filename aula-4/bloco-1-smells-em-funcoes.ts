import express from "express";

// =============================================================================
// BLOCO 1 — Smells mais comuns em funções
// =============================================================================
// Contexto:
//   Esta API calcula uma prévia de pedido para uma loja simples.
//   O comportamento funciona, mas a função principal dá sinais de manutenção
//   difícil: parâmetros demais, números mágicos e responsabilidades misturadas.
//
// Caminho recomendado:
//   1) Rode `npm run bloco1` e copie a saída atual.
//   2) Extraia variáveis com nomes claros para desconto, imposto e frete.
//   3) Troque strings e números mágicos por constantes nomeadas.
//   4) Agrupe os parâmetros soltos em um objeto de opções.
//   5) Extraia funções pequenas, rodando o arquivo depois de cada passo.
//
// Dica:
//   Refatorar não é mudar a regra. No fim, o console deve imprimir a mesma coisa.
// =============================================================================

type OrderItem = {
	name: string;
	priceInCents: number;
	quantity: number;
};

enum couponCodesAndDiscounts {
	BLACKFRIDAY = "BLACKFRIDAY",
	FRETEGRATIS = "FRETEGRATIS"
}

const BLACKFRIDAY_DISCOUNT = 0.1;
const MAX_DISCOUNT = 0.4;
const FREE_SHIPPING_THRESHOLD = 50000;
	


type Order = {
	id: string;
	items: OrderItem[];
};

// Refatoração - Função de Responsabilidade Única ( somar subtotal )
function sumSubtotal(items: OrderItem[]): number {
	let subtotal = 0;
	for (const item of items) {
		subtotal = subtotal + item.priceInCents * item.quantity;
	}
	return subtotal;
}

function hasFreeShipping(subtotal: number, couponCode: couponCodesAndDiscounts): boolean {
	return subtotal > FREE_SHIPPING_THRESHOLD || couponCode === couponCodesAndDiscounts.FRETEGRATIS
}

function applyBlackFridayDiscount(currentDiscount: number, couponCode: couponCodesAndDiscounts): number {
	if(couponCode === couponCodesAndDiscounts.BLACKFRIDAY) {
		return currentDiscount + BLACKFRIDAY_DISCOUNT;
	}
	return currentDiscount;
}

function restrictMaxDiscount(currentDiscount: number): number {
	return currentDiscount > MAX_DISCOUNT ? MAX_DISCOUNT : currentDiscount;
}
export function calculateOrderTotal(
	order: Order,
	discount: number,
	tax: number,
	shipping: number,
	coupon: couponCodesAndDiscounts,
): number {
	// soma os itens
	let subtotal = sumSubtotal(order.items);

	// aplica cupom
	let finalDiscount = discount;
    finalDiscount = applyBlackFridayDiscount(finalDiscount, coupon);
	if(hasFreeShipping(subtotal, coupon)) {
		shipping = 0;
	}

	// desconto maximo de 40%
	finalDiscount = restrictMaxDiscount(finalDiscount);

	// calcula total
	const discountValue = subtotal * finalDiscount;
	const totalBeforeTax = subtotal - discountValue;
	const taxValue = totalBeforeTax * tax;
	const total = totalBeforeTax + taxValue + shipping;

	return Math.round(total);
}

const app = express();
app.use(express.json());

app.post("/orders/preview", (request, response) => {
	const total = calculateOrderTotal(
		request.body.order,
		Number(request.body.discount ?? 0),
		Number(request.body.tax ?? 0),
		Number(request.body.shipping ?? 0),
		(request.body.coupon ?? "") as couponCodesAndDiscounts,
	);

	response.json({ totalInCents: total });
});

export { app };

const sampleOrder: Order = {
	id: "order-1001",
	items: [
		{ name: "Mouse", priceInCents: 8900, quantity: 1 },
		{ name: "Teclado", priceInCents: 15990, quantity: 1 },
	],
};

console.log(
	"Total com BLACKFRIDAY:",
	calculateOrderTotal(sampleOrder, 0.05, 0.08, 2500, couponCodesAndDiscounts.BLACKFRIDAY),
);
console.log(
	"Total com FRETEGRATIS:",
	calculateOrderTotal(sampleOrder, 0, 0.08, 2500, couponCodesAndDiscounts.FRETEGRATIS),
);
