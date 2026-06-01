import express from "express";

// =============================================================================
// BLOCO 1 — Resposta exemplo (SRP aplicado)
// =============================================================================
// Aplicado:
//   - `UserValidator` concentra validação de entrada.
//   - `UserRepository` concentra persistência em memória.
//   - `EmailService` concentra envio de boas-vindas.
//   - `UserService` orquestra a criação e mantém a regra de negócio principal.
// =============================================================================

type Plan = "free" | "pro";

type CreateUserInput = {
	name: string;
	email: string;
	plan: Plan;
};

type User = {
	id: number;
	name: string;
	email: string;
	plan: Plan;
	active: boolean;
	trialDays: number;
};

class UserValidator {
	validate(input: CreateUserInput): void {
		if (input.name.trim().length < 2) {
			throw new Error("Nome invalido");
		}

		if (!input.email.includes("@") || !input.email.includes(".")) {
			throw new Error("Email invalido");
		}
	}
}

class UserRepository {
	private users: User[] = [];

	nextId(): number {
		return this.users.length + 1;
	}

	findByEmail(email: string): User | undefined {
		return this.users.find((user) => user.email === email);
	}

	save(user: User): void {
		this.users.push(user);
	}

	countActive(): number {
		return this.users.filter((user) => user.active).length;
	}
}

class EmailService {
	sendWelcomeEmail(user: User): void {
		console.log("Enviando boas-vindas para " + user.email);
	}
}

export class UserService {
	constructor(
		private readonly validator = new UserValidator(),
		private readonly repository = new UserRepository(),
		private readonly emailService = new EmailService(),
	) {}

	createUser(input: CreateUserInput): string {
		this.validator.validate(input);

		const normalizedEmail = input.email.trim().toLowerCase();

		if (this.repository.findByEmail(normalizedEmail)) {
			throw new Error("Email ja cadastrado");
		}

		const user: User = {
			id: this.repository.nextId(),
			name: input.name.trim(),
			email: normalizedEmail,
			plan: input.plan,
			active: true,
			trialDays: this.calculateTrialDays(input.plan),
		};

		this.repository.save(user);
		this.emailService.sendWelcomeEmail(user);

		return "Usuario " + user.name + " criado com " + user.trialDays + " dias";
	}

	countActiveUsers(): number {
		return this.repository.countActive();
	}

	private calculateTrialDays(plan: Plan): number {
		return plan === "pro" ? 14 : 7;
	}
}

const app = express();
app.use(express.json());

const service = new UserService();

app.post("/users", (request, response) => {
	const message = service.createUser(request.body);
	response.status(201).json({ message });
});

export { app };

console.log(
	service.createUser({ name: "Ana", email: "ANA@EXEMPLO.COM", plan: "pro" }),
);
console.log(
	service.createUser({ name: "Bia", email: "bia@exemplo.com", plan: "free" }),
);
console.log("Usuarios ativos:", service.countActiveUsers());
