import express from "express";

// =============================================================================
// TRABALHO DE CASA — Resposta exemplo (REFATORADO)
// =============================================================================
// Aplicado:
//   - Rename em nomes opacos.
//   - Constantes para preços, percentuais e cupom.
//   - Extract Function para preço base, desconto e total mínimo.
//   - Saída preservada.
// =============================================================================

type TicketType = "normal" | "vip" | "meia";
type CustomerType = "estudante" | "cliente" | "funcionario";

type TicketQuote = {
	type: TicketType;
	quantity: number;
	customerType: CustomerType;
	coupon: string;
};

const PRICE_BY_TICKET_TYPE: Record<TicketType, number> = {
	normal: 4000,
	vip: 9000,
	meia: 2000,
};

const DISCOUNT_BY_CUSTOMER_TYPE: Record<CustomerType, number> = {
	estudante: 0.1,
	cliente: 0,
	funcionario: 0.2,
};

const CLASS_COUPON = "AULA4";
const CLASS_COUPON_DISCOUNT_IN_CENTS = 500;

export function calculateTicketTotal(ticket: TicketQuote): number {
	const baseTotal = getTicketPrice(ticket.type) * ticket.quantity;
	const customerDiscount = baseTotal * getCustomerDiscount(ticket.customerType);
	const couponDiscount = getCouponDiscount(ticket.coupon);

	return roundTotal(Math.max(baseTotal - customerDiscount - couponDiscount, 0));
}

function getTicketPrice(type: TicketType): number {
	return PRICE_BY_TICKET_TYPE[type];
}

function getCustomerDiscount(customerType: CustomerType): number {
	return DISCOUNT_BY_CUSTOMER_TYPE[customerType];
}

function getCouponDiscount(coupon: string): number {
	return coupon === CLASS_COUPON ? CLASS_COUPON_DISCOUNT_IN_CENTS : 0;
}

function roundTotal(total: number): number {
	return Math.round(total);
}

const app = express();
app.use(express.json());

app.post("/tickets/quote", (request, response) => {
	response.json({ totalInCents: calculateTicketTotal(request.body) });
});

export { app };

console.log(
	"Estudante normal x2:",
	calculateTicketTotal({
		type: "normal",
		quantity: 2,
		customerType: "estudante",
		coupon: "",
	}),
);
console.log(
	"Funcionario vip x1 com cupom:",
	calculateTicketTotal({
		type: "vip",
		quantity: 1,
		customerType: "funcionario",
		coupon: "AULA4",
	}),
);
console.log(
	"Cliente meia x3:",
	calculateTicketTotal({
		type: "meia",
		quantity: 3,
		customerType: "cliente",
		coupon: "",
	}),
);
