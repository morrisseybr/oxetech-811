import express from "express";

// =============================================================================
// BLOCO 3 — Resposta exemplo (ISP e DIP aplicados)
// =============================================================================
// Aplicado:
//   - `OrderRepository` expõe apenas os métodos usados pelo serviço.
//   - `OrderService` depende da abstração, não do cliente concreto.
//   - `PrismaOrderRepository` isola o detalhe de infraestrutura.
//   - `FakeOrderRepository` valida a regra sem banco real.
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

interface OrderRepository {
	findById(id: string): OrderRecord | null;
	save(order: OrderRecord): void;
}

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

class PrismaOrderRepository implements OrderRepository {
	constructor(private readonly prisma = new PrismaLikeClient()) {}

	findById(id: string): OrderRecord | null {
		return this.prisma.order.findUnique({ where: { id } });
	}

	save(order: OrderRecord): void {
		this.prisma.order.update({
			where: { id: order.id },
			data: order,
		});
	}
}

class FakeOrderRepository implements OrderRepository {
	constructor(private readonly orders: OrderRecord[]) {}

	findById(id: string): OrderRecord | null {
		return this.orders.find((order) => order.id === id) ?? null;
	}

	save(order: OrderRecord): void {
		const index = this.orders.findIndex((item) => item.id === order.id);
		if (index === -1) {
			this.orders.push(order);
			return;
		}
		this.orders[index] = order;
	}
}

export class OrderService {
	constructor(private readonly orders: OrderRepository) {}

	payOrder(input: PayOrderInput): string {
		const order = this.orders.findById(input.orderId);

		if (!order) {
			throw new Error("Pedido nao encontrado");
		}

		if (order.status === "canceled") {
			throw new Error("Pedido cancelado nao pode ser pago");
		}

		if (order.status === "paid") {
			return "Pedido " + order.id + " ja estava pago";
		}

		const paidOrder: OrderRecord = { ...order, status: "paid" };
		this.orders.save(paidOrder);

		return "Pedido " + paidOrder.id + " pago: " + paidOrder.totalInCents;
	}
}

const app = express();
app.use(express.json());

const service = new OrderService(new PrismaOrderRepository());

app.post("/orders/:id/pay", (request, response) => {
	const message = service.payOrder({ orderId: request.params.id });
	response.json({ message });
});

export { app };

const fakeRepository = new FakeOrderRepository([
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
]);
const fakeService = new OrderService(fakeRepository);

console.log(fakeService.payOrder({ orderId: "order-3001" }));
console.log(fakeService.payOrder({ orderId: "order-3002" }));
