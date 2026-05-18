import express from "express";

// =============================================================================
// BLOCO 3 — Anti-patterns e refatoração segura
// =============================================================================
// Contexto:
//   Esta API mostra status de pedidos para clientes e para o time interno.
//   A regra funciona, mas foi copiada em dois lugares e ficou difícil de seguir.
//
// Caminho recomendado:
//   1) Rode `npm run bloco3` e anote a saída.
//   2) Encontre a regra duplicada de status.
//   3) Extraia uma função `getOrderStatus(order)`.
//   4) Troque os dois blocos duplicados pela função extraída.
//   5) Remova código morto somente depois de validar a saída.
//
// Dica:
//   Faça uma mudança por vez. Refatoração segura é quase entediante de tão
//   pequena, e isso é uma qualidade.
// =============================================================================

type Order = {
	id: string;
	paid: boolean;
	shipped: boolean;
	canceled: boolean;
	daysSinceCreated: number;
};

export function buildCustomerMessage(order: Order): string {
	let status = "";

	if (order.canceled) {
		status = "cancelado";
	} else {
		if (order.shipped) {
			status = "enviado";
		} else {
			if (order.paid) {
				status = "em separacao";
			} else {
				if (order.daysSinceCreated > 3) {
					status = "pagamento atrasado";
				} else {
					status = "aguardando pagamento";
				}
			}
		}
	}

	return "Pedido " + order.id + ": " + status;
}

export function buildAdminTag(order: Order): string {
	let status = "";

	if (order.canceled) {
		status = "cancelado";
	} else if (order.shipped) {
		status = "enviado";
	} else if (order.paid) {
		status = "em separacao";
	} else if (order.daysSinceCreated > 3) {
		status = "pagamento atrasado";
	} else {
		status = "aguardando pagamento";
	}

	return "[" + status.toUpperCase() + "] " + order.id;
}

function getOldStatusByCode(code: number): string {
	if (code === 1) return "novo";
	if (code === 2) return "pago";
	if (code === 3) return "postado";
	return "desconhecido";
}

const app = express();

app.get("/orders/:id/customer", (_request, response) => {
	response.json({ message: buildCustomerMessage(sampleOrders[0]) });
});

app.get("/orders/:id/admin", (_request, response) => {
	response.json({ tag: buildAdminTag(sampleOrders[0]) });
});

export { app, getOldStatusByCode };

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
