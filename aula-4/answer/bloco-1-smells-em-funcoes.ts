import express from "express";

// =============================================================================
// BLOCO 1 — Smells mais comuns em funções (REFATORADO)
// =============================================================================
// Aplicado:
//   - Parâmetros soltos agrupados em `OrderPricingOptions`.
//   - Strings e números mágicos substituídos por constantes nomeadas.
//   - Cálculo dividido em funções pequenas.
//   - Comentários redundantes removidos.
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

type CouponCode = "BLACKFRIDAY" | "FRETEGRATIS" | "";

type OrderPricingOptions = {
	discountRate: number;
	taxRate: number;
	shippingInCents: number;
	coupon: CouponCode;
};

const BLACK_FRIDAY_EXTRA_DISCOUNT = 0.1;
const MAX_DISCOUNT_RATE = 0.4;
const FREE_SHIPPING_MINIMUM_IN_CENTS = 50000;

export function calculateOrderTotal(
	order: Order,
	options: OrderPricingOptions,
): number {
	const subtotal = calculateSubtotal(order.items);
	const discountRate = calculateDiscountRate(
		options.discountRate,
		options.coupon,
	);
	const shipping = calculateShipping(
		subtotal,
		options.shippingInCents,
		options.coupon,
	);
	const discountValue = subtotal * discountRate;
	const totalBeforeTax = subtotal - discountValue;
	const taxValue = totalBeforeTax * options.taxRate;

	return Math.round(totalBeforeTax + taxValue + shipping);
}

function calculateSubtotal(items: OrderItem[]): number {
	return items.reduce(
		(subtotal, item) => subtotal + item.priceInCents * item.quantity,
		0,
	);
}

function calculateDiscountRate(
	baseDiscountRate: number,
	coupon: CouponCode,
): number {
	const couponDiscount =
		coupon === "BLACKFRIDAY" ? BLACK_FRIDAY_EXTRA_DISCOUNT : 0;
	return Math.min(baseDiscountRate + couponDiscount, MAX_DISCOUNT_RATE);
}

function calculateShipping(
	subtotal: number,
	shippingInCents: number,
	coupon: CouponCode,
): number {
	if (coupon === "FRETEGRATIS" || subtotal > FREE_SHIPPING_MINIMUM_IN_CENTS) {
		return 0;
	}

	return shippingInCents;
}

const app = express();
app.use(express.json());

app.post("/orders/preview", (request, response) => {
	const total = calculateOrderTotal(request.body.order, {
		discountRate: Number(request.body.discount ?? 0),
		taxRate: Number(request.body.tax ?? 0),
		shippingInCents: Number(request.body.shipping ?? 0),
		coupon: String(request.body.coupon ?? "") as CouponCode,
	});

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
		discountRate: 0.05,
		taxRate: 0.08,
		shippingInCents: 2500,
		coupon: "BLACKFRIDAY",
	}),
);
console.log(
	"Total com FRETEGRATIS:",
	calculateOrderTotal(sampleOrder, {
		discountRate: 0,
		taxRate: 0.08,
		shippingInCents: 2500,
		coupon: "FRETEGRATIS",
	}),
);
