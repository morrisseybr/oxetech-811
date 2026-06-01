import express from "express";

// =============================================================================
// BLOCO 2 — Resposta exemplo (OCP e LSP aplicados)
// =============================================================================
// Aplicado:
//   - `DiscountPolicy` define um contrato pequeno e previsível.
//   - Cada variação de desconto fica em uma implementação substituível.
//   - `OrderPriceCalculator` depende da abstração, não de tipos concretos.
//   - Novo desconto entra como nova classe, sem editar a calculadora.
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

interface DiscountPolicy {
	calculateDiscount(order: Order): number;
}

class NoDiscountPolicy implements DiscountPolicy {
	calculateDiscount(): number {
		return 0;
	}
}

class VipDiscountPolicy implements DiscountPolicy {
	calculateDiscount(order: Order): number {
		return calculateSubtotal(order) * 0.15;
	}
}

class PartnerDiscountPolicy implements DiscountPolicy {
	calculateDiscount(order: Order): number {
		return calculateSubtotal(order) * 0.1;
	}
}

class EmployeeDiscountPolicy implements DiscountPolicy {
	calculateDiscount(): number {
		return 5000;
	}
}

class OrderPriceCalculator {
	constructor(private readonly discountPolicy: DiscountPolicy) {}

	calculateTotal(order: Order): number {
		const subtotal = calculateSubtotal(order);
		const discount = this.discountPolicy.calculateDiscount(order);

		return Math.max(subtotal - discount, 0);
	}
}

function calculateSubtotal(order: Order): number {
	let subtotal = 0;
	for (const item of order.items) {
		subtotal = subtotal + item.priceInCents * item.quantity;
	}
	return subtotal;
}

const app = express();
app.use(express.json());

app.post("/orders/discount-preview", (request, response) => {
	const calculator = new OrderPriceCalculator(new VipDiscountPolicy());
	const total = calculator.calculateTotal(request.body.order);
	response.json({ totalInCents: total });
});

export { app, OrderPriceCalculator };

const sampleOrder: Order = {
	id: "order-2001",
	items: [
		{ name: "Curso Node", priceInCents: 12000, quantity: 1 },
		{ name: "Mentoria", priceInCents: 8000, quantity: 1 },
	],
};

console.log(
	"Cliente regular:",
	new OrderPriceCalculator(new NoDiscountPolicy()).calculateTotal(sampleOrder),
);
console.log(
	"Cliente vip:",
	new OrderPriceCalculator(new VipDiscountPolicy()).calculateTotal(sampleOrder),
);
console.log(
	"Cliente parceiro:",
	new OrderPriceCalculator(new PartnerDiscountPolicy()).calculateTotal(
		sampleOrder,
	),
);
console.log(
	"Funcionario:",
	new OrderPriceCalculator(new EmployeeDiscountPolicy()).calculateTotal(
		sampleOrder,
	),
);
