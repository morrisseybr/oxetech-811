import express from "express";

// =============================================================================
// BLOCO 2 — Smells em classes e módulos
// =============================================================================
// Contexto:
//   Esta API cadastra usuários. A classe `UserService` virou o lugar onde tudo
//   acontece: valida entrada, mexe no repositório, calcula regra e envia e-mail.
//
// Caminho recomendado:
//   1) Rode `npm run bloco2` e guarde a saída.
//   2) Extraia a validação para uma função ou classe pequena.
//   3) Mova a contagem de usuários ativos para perto do repositório.
//   4) Crie um conceito simples para `Email`, em vez de espalhar string.
//   5) Extraia o envio de e-mail para uma dependência separada.
//
// Dica:
//   Não precisa criar vários arquivos. Para a prática, deixe tudo neste arquivo
//   e foque em separar responsabilidades com nomes claros.
// =============================================================================

type Plan = "free" | "pro";

type UserParams = {
	id: number;
	name: string;
	email: string;
	plan: Plan;
	active: boolean;
	trialDays: number;
};

class User {
	id: number;
	name: string;
	email: string;
	plan: Plan;
	active: boolean;
	trialDays: number;

	constructor(params: UserParams) {
		this.id = params.id;
		this.name = params.name;
		this.email = params.email;
		this.plan = params.plan;
		this.active = params.active;
		this.trialDays = params.trialDays;
	}
}

type CreateUserInput = {
	name: string;
	email: string;
	plan: Plan;
};

class UserRepository {
	users: User[] = [];

	findByEmail(email: string): User | undefined {
		return this.users.find((user) => user.email === email);
	}

	save(user: User): void {
		this.users.push(user);
	}

	countActive(): number {
		let total = 0;
		for (const user of this.users) {
			if (user.active) total++;
		}
		return total;
	}
}

class UserValidator {
	private validateName(name: string): void {
		if (name.trim().length < 2) {
			throw new Error("Nome invalido");
		}
	}

	private validateEmail(email: string): void {
		if (!email.includes("@") || !email.includes(".")) {
			throw new Error("Email invalido");
		}
	}

	validate(input: CreateUserInput): void {
		this.validateName(input.name);
		this.validateEmail(input.email);
	}
}

class TrialPolicy {
	calculateTrialDays(plan: Plan): number {
		if (plan === "pro") {
			return 14;
		}
		return 7;
	}
}

// Refatorar isso aqui depois de chegar da faculdade
class Email {
	readonly value: string;

	constructor(raw: string) {
		const normalized = raw.trim().toLowerCase();
		if (!normalized.includes("@") || !normalized.includes(".")) {
			throw new Error("Email invalido");
		}
		this.value = normalized;
	}
}

function sendEmail(email: string): void {
	console.log("Enviando boas-vindas para " + email);
}

export class UserService {
	constructor(
		private readonly repository = new UserRepository(),
		private readonly validator = new UserValidator(),
		private readonly trialPolicy = new TrialPolicy(),
		private readonly emailSender = { send: sendEmail },
	) {}

	createUser(input: CreateUserInput): string {
		this.validator.validate(input);

		if (this.repository.findByEmail(input.email)) {
			throw new Error("Email ja cadastrado");
		}

		const trialDays = this.trialPolicy.calculateTrialDays(input.plan);

		const email = new Email(input.email);

		const user = new User({
			id: this.repository.users.length + 1,
			name: input.name.trim(),
			email: email.value,
			plan: input.plan,
			active: true,
			trialDays: trialDays,
		});

		this.repository.save(user);

		this.emailSender.send(user.email);

		return "Usuario " + user.name + " criado com " + user.trialDays + " dias";
	}

	countActiveUsers(): number {
		return this.repository.countActive();
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
