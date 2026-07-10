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

export class UserValidator {
	validateInput(input: CreateUserInput, users: User[]): void {
		if (input.name.trim().length < 2) {
			throw new Error("Nome invalido");
		}

		if (!input.email.includes("@") || !input.email.includes(".")) {
			throw new Error("Email invalido");
		}
		const normalizedEmail = input.email.trim().toLowerCase();
		if (users.some((user) => user.email === input.email)) {
			throw new Error("Email ja cadastrado");
		}
	}

	validateTrialDays(plan: Plan): number{
		return plan === "pro" ? 14 : 7  
	}
}

export class UserRepository {
	private users: User[] = [];

	createAndSaveUser(input: CreateUserInput, trialDays: number): User {
		const user: User = {
			id: this.users.length + 1,
			name: input.name.trim(),
			email: input.email.trim().toLowerCase(),
			plan: input.plan,
			active: true,
			trialDays: trialDays,
		};
		this.users.push(user);
		return user;
	}

	getUsers(): User[]{
		return this.users;
	}

	countUsers(){
		let total = 0;
		for (const user of this.users) {
			if (user.active) {
				total = total + 1;
			}
		}
		return total;
	}
} 

export class EmailService {
	sendWelcomeEmail(email: string): void {
		console.log("Enviando boas-vindas para " + email);
	}
}
export class UserService {
	createUser(input: CreateUserInput): string {
		
		const validator: UserValidator = new UserValidator();
		const repository = new UserRepository();

		validator.validateInput(input, repository.getUsers());

		const trialDays = validator.validateTrialDays(input.plan)

		const user =  repository.createAndSaveUser(input, trialDays);

		const emailService = new EmailService();
		emailService.sendWelcomeEmail(user.email)
		return "Usuario " + user.name + " criado com " + user.trialDays + " dias";
	}

	checkActiveUsers(){
		const repository = new UserRepository();
		return repository.countUsers();
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
console.log("Usuarios ativos:", service.checkActiveUsers());
