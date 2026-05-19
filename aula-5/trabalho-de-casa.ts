import express from "express";

// =============================================================================
// TRABALHO DE CASA — Aplicando SOLID com uma mudança pequena
// =============================================================================
// Entrega:
//   Abra um PR semântico no repositório do curso até a véspera da Aula 6.
//
// O que fazer:
//   1) Escolha UM princípio SOLID violado neste arquivo.
//   2) Explique no PR qual smell serviu de gatilho para a mudança.
//   3) Aplique uma refatoração pequena e segura.
//   4) Valide que `npm run casa` continua imprimindo a mesma saída.
//
// Sugestões:
//   - SRP: separar validação da criação de assinatura.
//   - OCP: substituir `if/else` de plano por políticas de preço.
//   - DIP: fazer o serviço depender de uma abstração de repositório.
//
// Dica:
//   O objetivo não é usar todos os princípios de uma vez. Escolha uma dor real,
//   melhore o design e preserve o comportamento.
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

export class SubscriptionService {
	private subscriptions: Subscription[] = [];

	createSubscription(input: CreateSubscriptionInput): string {
		if (!input.customerEmail.includes("@")) {
			throw new Error("Email invalido");
		}

		if (input.seats < 1) {
			throw new Error("Assinatura precisa ter pelo menos um assento");
		}

		let pricePerSeat = 2900;
		if (input.plan === "pro") {
			pricePerSeat = 5900;
		} else if (input.plan === "enterprise") {
			pricePerSeat = 9900;
		}

		const subscription: Subscription = {
			id: this.subscriptions.length + 1,
			customerEmail: input.customerEmail.trim().toLowerCase(),
			plan: input.plan,
			seats: input.seats,
			monthlyPriceInCents: pricePerSeat * input.seats,
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
