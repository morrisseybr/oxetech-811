import express from "express";

// =============================================================================
// BLOCO 3 — Anti-patterns e refatoração segura (REFATORADO)
// =============================================================================
// Aplicado:
//   - Regra repetida extraída para `getOrderStatus`.
//   - Os dois formatos de saída continuam separados.
//   - Código morto removido.
// =============================================================================

type Order = {
	id: string;
	paid: boolean;
	shipped: boolean;
	canceled: boolean;
	daysSinceCreated: number;
};

export function getOrderStatus(order: Order): string {
	if (order.canceled) return "cancelado";
	if (order.shipped) return "enviado";
	if (order.paid) return "em separacao";
	if (order.daysSinceCreated > 3) return "pagamento atrasado";
	return "aguardando pagamento";
}

export function buildCustomerMessage(order: Order): string {
	return "Pedido " + order.id + ": " + getOrderStatus(order);
}

export function buildAdminTag(order: Order): string {
	return "[" + getOrderStatus(order).toUpperCase() + "] " + order.id;
}

const app = express();

app.get("/orders/:id/customer", (_request, response) => {
	response.json({ message: buildCustomerMessage(sampleOrders[0]) });
});

app.get("/orders/:id/admin", (_request, response) => {
	response.json({ tag: buildAdminTag(sampleOrders[0]) });
});

export { app };

const sampleOrders: Order[] = [
	{
		id: "A100",
		paid: false,
		shipped: false,
		canceled: false,
		daysSinceCreated: 5,
	},
	{
		id: "A101",
		paid: true,
		shipped: false,
		canceled: false,
		daysSinceCreated: 1,
	},
	{
		id: "A102",
		paid: true,
		shipped: true,
		canceled: false,
		daysSinceCreated: 2,
	},
];

for (const order of sampleOrders) {
	console.log(buildCustomerMessage(order));
	console.log(buildAdminTag(order));
}
