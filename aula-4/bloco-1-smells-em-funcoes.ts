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

type Order = {
	id: string;
	items: OrderItem[];
};

type CalculateOrderTotalOptions = {
	discount: number;
	tax: number;
	shipping: number;
	coupon: string;
};

const DISCOUNT_BLACKFRIDAY = 0.1;
const DISCOUNT_SHIPPING = 0;
const DISCOUNT_MAX = 0.4;
const FREE_SHIPPING_THRESHOLD = 50000;

export function calculateOrderTotal(
	order: Order,
	orderOptions: CalculateOrderTotalOptions,
): number {
	const subtotal = calculateSubtotal(order.items);
	const discount = calculateDiscount(
		orderOptions.discount,
		orderOptions.coupon,
	);
	const shipping = calculateShipping(
		subtotal,
		orderOptions.shipping,
		orderOptions.coupon,
	);

	// calcula total
	const discountValue = subtotal * discount;
	const totalBeforeTax = subtotal - discountValue;
	const taxValue = totalBeforeTax * orderOptions.tax;
	const total = totalBeforeTax + taxValue + shipping;

	return Math.round(total);
}

function calculateSubtotal(orderItems: OrderItem[]): number {
	let subtotal = 0;
	for (const item of orderItems) {
		subtotal = subtotal + item.priceInCents * item.quantity;
	}
	return subtotal;
}

function calculateDiscount(discount: number, coupon: string): number {
	let finalDiscount = discount;

	if (coupon === "BLACKFRIDAY") {
		finalDiscount = finalDiscount + DISCOUNT_BLACKFRIDAY;
	}

	if (finalDiscount > DISCOUNT_MAX) {
		finalDiscount = DISCOUNT_MAX;
	}

	return finalDiscount;
}

function calculateShipping(
	subtotal: number,
	shipping: number,
	coupon: string,
): number {
	if (coupon === "FRETEGRATIS") {
		shipping = DISCOUNT_SHIPPING;
	}

	if (subtotal > FREE_SHIPPING_THRESHOLD) {
		shipping = DISCOUNT_SHIPPING;
	}

	return shipping;
}

const app = express();
app.use(express.json());

app.post("/orders/preview", (request, response) => {
	const options: CalculateOrderTotalOptions = {
		discount: Number(request.body.discount ?? 0),
		tax: Number(request.body.tax ?? 0),
		shipping: Number(request.body.shipping ?? 0),
		coupon: String(request.body.coupon ?? ""),
	};

	const total = calculateOrderTotal(request.body.order, options);

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
	calculateOrderTotal(sampleOrder, {
		discount: 0.05,
		tax: 0.08,
		shipping: 2500,
		coupon: "BLACKFRIDAY",
	}),
);
console.log(
	"Total com FRETEGRATIS:",
	calculateOrderTotal(sampleOrder, {
		discount: 0,
		tax: 0.08,
		shipping: 2500,
		coupon: "FRETEGRATIS",
	}),
);
