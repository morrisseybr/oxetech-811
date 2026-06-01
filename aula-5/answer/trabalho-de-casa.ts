import express from "express";

// =============================================================================
// TRABALHO DE CASA — Resposta exemplo (SRP e OCP aplicados)
// =============================================================================
// Aplicado:
//   - Validação separada em `SubscriptionValidator`.
//   - Políticas de preço substituem o `if/else` por plano.
//   - Serviço continua orquestrando a criação com a mesma saída no console.
// =============================================================================

type SubscriptionPlan = "starter" | "pro" | "enterprise";

type CreateSubscriptionInput = {
	customerEmail: string;
	plan: SubscriptionPlan;
	seats: number;
};

type Subscription = {
	id: number;
	customerEmail: string;
	plan: SubscriptionPlan;
	seats: number;
	monthlyPriceInCents: number;
};

interface PricingPolicy {
	calculateMonthlyPrice(seats: number): number;
}

class StarterPricingPolicy implements PricingPolicy {
	calculateMonthlyPrice(seats: number): number {
		return seats * 2900;
	}
}

class ProPricingPolicy implements PricingPolicy {
	calculateMonthlyPrice(seats: number): number {
		return seats * 5900;
	}
}

class EnterprisePricingPolicy implements PricingPolicy {
	calculateMonthlyPrice(seats: number): number {
		return seats * 9900;
	}
}

class SubscriptionValidator {
	validate(input: CreateSubscriptionInput): void {
		if (!input.customerEmail.includes("@")) {
			throw new Error("Email invalido");
		}

		if (input.seats < 1) {
			throw new Error("Assinatura precisa ter pelo menos um assento");
		}
	}
}

class PricingPolicyFactory {
	create(plan: SubscriptionPlan): PricingPolicy {
		const policies: Record<SubscriptionPlan, PricingPolicy> = {
			starter: new StarterPricingPolicy(),
			pro: new ProPricingPolicy(),
			enterprise: new EnterprisePricingPolicy(),
		};

		return policies[plan];
	}
}

export class SubscriptionService {
	private subscriptions: Subscription[] = [];

	constructor(
		private readonly validator = new SubscriptionValidator(),
		private readonly pricingPolicyFactory = new PricingPolicyFactory(),
	) {}

	createSubscription(input: CreateSubscriptionInput): string {
		this.validator.validate(input);

		const pricingPolicy = this.pricingPolicyFactory.create(input.plan);
		const subscription: Subscription = {
			id: this.subscriptions.length + 1,
			customerEmail: input.customerEmail.trim().toLowerCase(),
			plan: input.plan,
			seats: input.seats,
			monthlyPriceInCents: pricingPolicy.calculateMonthlyPrice(input.seats),
		};

		this.subscriptions.push(subscription);

		console.log("Enviando contrato para " + subscription.customerEmail);

		return (
			"Assinatura " +
			subscription.id +
			" criada por " +
			subscription.monthlyPriceInCents
		);
	}
}

const app = express();
app.use(express.json());

const service = new SubscriptionService();

app.post("/subscriptions", (request, response) => {
	const message = service.createSubscription(request.body);
	response.status(201).json({ message });
});

export { app };

console.log(
	service.createSubscription({
		customerEmail: "ANA@EXEMPLO.COM",
		plan: "starter",
		seats: 2,
	}),
);
console.log(
	service.createSubscription({
		customerEmail: "time@empresa.com",
		plan: "enterprise",
		seats: 5,
	}),
);
