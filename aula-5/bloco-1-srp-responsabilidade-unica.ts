import express from "express";

// =============================================================================
// BLOCO 1 — SRP: Single Responsibility Principle
// =============================================================================
// Contexto:
//   Esta API cadastra usuários. O `UserService` funciona, mas virou uma classe
//   com motivos demais para mudar: valida entrada, controla dados em memória,
//   aplica regra de trial e envia e-mail de boas-vindas.
//
// Caminho recomendado:
//   1) Rode `npm run bloco1` e guarde a saída.
//   2) Extraia a validação para `UserValidator`.
//   3) Extraia persistência para `UserRepository`.
//   4) Extraia envio de e-mail para `EmailService`.
//   5) Deixe o `UserService` apenas orquestrando a criação.
//
// Dica:
//   Se você precisa usar "e" para explicar a classe, ela provavelmente tem
//   responsabilidades demais: valida e salva e envia e-mail.
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

export class UserService {
	private users: User[] = [];

	createUser(input: CreateUserInput): string {
		if (input.name.trim().length < 2) {
			throw new Error("Nome invalido");
		}

		if (!input.email.includes("@") || !input.email.includes(".")) {
			throw new Error("Email invalido");
		}

		const normalizedEmail = input.email.trim().toLowerCase();

		if (this.users.some((user) => user.email === normalizedEmail)) {
			throw new Error("Email ja cadastrado");
		}

		let trialDays = 7;
		if (input.plan === "pro") {
			trialDays = 14;
		}

		const user: User = {
			id: this.users.length + 1,
			name: input.name.trim(),
			email: normalizedEmail,
			plan: input.plan,
			active: true,
			trialDays,
		};

		this.users.push(user);

		console.log("Enviando boas-vindas para " + user.email);

		return "Usuario " + user.name + " criado com " + user.trialDays + " dias";
	}

	countActiveUsers(): number {
		let total = 0;
		for (const user of this.users) {
			if (user.active) {
				total = total + 1;
			}
		}
		return total;
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
