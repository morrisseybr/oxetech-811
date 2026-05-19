import express from "express";

// =============================================================================
// BLOCO 3 — ISP e DIP: Interfaces pequenas, dependências invertidas
// =============================================================================
// Contexto:
//   Este `OrderService` consulta e salva pedidos usando um cliente parecido com
//   Prisma diretamente. A regra de negócio fica acoplada ao detalhe do banco e
//   só parece testável quando existe uma implementação completa disponível.
//
// Caminho recomendado:
//   1) Rode `npm run bloco3` e guarde a saída.
//   2) Crie a interface pequena `OrderRepository` com apenas o que o serviço usa.
//   3) Faça o `OrderService` depender da interface, não do cliente concreto.
//   4) Crie `PrismaOrderRepository` fora da regra de negócio.
//   5) Teste a regra com um repositório fake em memória.
//
// Dica:
//   Se a regra de negócio não roda sem banco, SDK ou API externa, o DIP ainda
//   não protegeu a parte mais importante do sistema.
// =============================================================================

type OrderStatus = "draft" | "paid" | "canceled";

type OrderRecord = {
	id: string;
	customerEmail: string;
	totalInCents: number;
	status: OrderStatus;
};

type PayOrderInput = {
	orderId: string;
};

class PrismaLikeClient {
	private orders: OrderRecord[] = [
		{
			id: "order-3001",
			customerEmail: "ana@exemplo.com",
			totalInCents: 15990,
			status: "draft",
		},
		{
			id: "order-3002",
			customerEmail: "bia@exemplo.com",
			totalInCents: 9900,
			status: "paid",
		},
	];

	order = {
		findUnique: ({ where }: { where: { id: string } }): OrderRecord | null => {
			return this.orders.find((order) => order.id === where.id) ?? null;
		},
		update: ({
			where,
			data,
		}: {
			where: { id: string };
			data: Partial<OrderRecord>;
		}): OrderRecord => {
			const order = this.orders.find((item) => item.id === where.id);
			if (!order) {
				throw new Error("Pedido nao encontrado");
			}
			Object.assign(order, data);
			return order;
		},
	};
}

export class OrderService {
	constructor(private readonly prisma = new PrismaLikeClient()) {}

	payOrder(input: PayOrderInput): string {
		const order = this.prisma.order.findUnique({
			where: { id: input.orderId },
		});

		if (!order) {
			throw new Error("Pedido nao encontrado");
		}

		if (order.status === "canceled") {
			throw new Error("Pedido cancelado nao pode ser pago");
		}

		if (order.status === "paid") {
			return "Pedido " + order.id + " ja estava pago";
		}

		const paidOrder = this.prisma.order.update({
			where: { id: order.id },
			data: { status: "paid" },
		});

		return "Pedido " + paidOrder.id + " pago: " + paidOrder.totalInCents;
	}
}

const app = express();
app.use(express.json());

const service = new OrderService();

app.post("/orders/:id/pay", (request, response) => {
	const message = service.payOrder({ orderId: request.params.id });
	response.json({ message });
});

export { app };

console.log(service.payOrder({ orderId: "order-3001" }));
console.log(service.payOrder({ orderId: "order-3002" }));
