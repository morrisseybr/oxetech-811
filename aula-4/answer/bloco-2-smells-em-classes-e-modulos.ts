import express from "express";

// =============================================================================
// BLOCO 2 — Smells em classes e módulos (REFATORADO)
// =============================================================================
// Aplicado:
//   - `UserService` ficou responsável por orquestrar o caso de uso.
//   - Validação, persistência, política de trial e envio de e-mail foram separados.
//   - A contagem de usuários ativos foi movida para o repositório.
//   - `Email` virou um conceito nomeado, não apenas uma string solta.
// =============================================================================

type Plan = "free" | "pro";

type User = {
	id: number;
	name: string;
	email: Email;
	plan: Plan;
	active: boolean;
	trialDays: number;
};

type CreateUserInput = {
	name: string;
	email: string;
	plan: Plan;
};

class Email {
	private constructor(private readonly value: string) {}

	static create(rawEmail: string): Email {
		const normalizedEmail = rawEmail.trim().toLowerCase();

		if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
			throw new Error("Email invalido");
		}

		return new Email(normalizedEmail);
	}

	toString(): string {
		return this.value;
	}
}

class UserRepository {
	private readonly users: User[] = [];

	findByEmail(email: Email): User | undefined {
		return this.users.find(
			(user) => user.email.toString() === email.toString(),
		);
	}

	save(user: User): void {
		this.users.push(user);
	}

	nextId(): number {
		return this.users.length + 1;
	}

	countActiveUsers(): number {
		return this.users.filter((user) => user.active).length;
	}
}

class UserValidator {
	validateName(name: string): string {
		const normalizedName = name.trim();

		if (normalizedName.length < 2) {
			throw new Error("Nome invalido");
		}

		return normalizedName;
	}
}

class TrialPolicy {
	trialDaysFor(plan: Plan): number {
		return plan === "pro" ? 14 : 7;
	}
}

class WelcomeEmailSender {
	send(email: Email): void {
		console.log("Enviando boas-vindas para " + email.toString());
	}
}

export class UserService {
	constructor(
		private readonly repository = new UserRepository(),
		private readonly validator = new UserValidator(),
		private readonly trialPolicy = new TrialPolicy(),
		private readonly emailSender = new WelcomeEmailSender(),
	) {}

	createUser(input: CreateUserInput): string {
		const name = this.validator.validateName(input.name);
		const email = Email.create(input.email);

		if (this.repository.findByEmail(email)) {
			throw new Error("Email ja cadastrado");
		}

		const user: User = {
			id: this.repository.nextId(),
			name,
			email,
			plan: input.plan,
			active: true,
			trialDays: this.trialPolicy.trialDaysFor(input.plan),
		};

		this.repository.save(user);
		this.emailSender.send(user.email);

		return "Usuario " + user.name + " criado com " + user.trialDays + " dias";
	}

	countActiveUsers(): number {
		return this.repository.countActiveUsers();
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
console.log("Usuarios ativos:", service.countActiveUsers());
