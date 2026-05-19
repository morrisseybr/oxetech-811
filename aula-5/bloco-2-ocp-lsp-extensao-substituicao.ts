import express from "express";

// =============================================================================
// BLOCO 2 — OCP e LSP: Extensão sem surpresa
// =============================================================================
// Contexto:
//   Esta API calcula desconto de pedidos. A cada novo tipo de cliente, a função
//   principal ganha mais um `if`. O código funciona, mas extensão exige editar
//   uma regra existente e aumenta o risco de quebrar casos antigos.
//
// Caminho recomendado:
//   1) Rode `npm run bloco2` e guarde a saída.
//   2) Crie a interface `DiscountPolicy`.
//   3) Implemente `VipDiscountPolicy` e `PartnerDiscountPolicy`.
//   4) Faça o consumidor depender apenas de `DiscountPolicy`.
//   5) Adicione uma nova política criando uma classe, sem editar a calculadora.
//
// Dica:
//   LSP aparece no contrato: toda política deve receber um pedido e devolver um
//   desconto válido, sem lançar exceção inesperada ou mudar o significado.
// =============================================================================

type CustomerType = "regular" | "vip" | "partner" | "employee";

type OrderItem = {
	name: string;
	priceInCents: number;
	quantity: number;
};

type Order = {
	id: string;
	items: OrderItem[];
};

export function calculateOrderTotal(
	order: Order,
	customerType: CustomerType,
): number {
	const subtotal = calculateSubtotal(order);
	let discount = 0;

	if (customerType === "vip") {
		discount = subtotal * 0.15;
	} else if (customerType === "partner") {
		discount = subtotal * 0.1;
	} else if (customerType === "employee") {
		discount = 5000;
	}

	return Math.max(subtotal - discount, 0);
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
	const total = calculateOrderTotal(
		request.body.order,
		request.body.customerType,
	);
	response.json({ totalInCents: total });
});

export { app };

const sampleOrder: Order = {
	id: "order-2001",
	items: [
		{ name: "Curso Node", priceInCents: 12000, quantity: 1 },
		{ name: "Mentoria", priceInCents: 8000, quantity: 1 },
	],
};

console.log("Cliente regular:", calculateOrderTotal(sampleOrder, "regular"));
console.log("Cliente vip:", calculateOrderTotal(sampleOrder, "vip"));
console.log("Cliente parceiro:", calculateOrderTotal(sampleOrder, "partner"));
console.log("Funcionario:", calculateOrderTotal(sampleOrder, "employee"));
