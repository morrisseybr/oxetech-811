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

type User = {
	id: number;
	name: string;
	email: string;
	plan: Plan;
	active: boolean;
	trialDays: number;
};

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
}

export class UserService {
	constructor(private readonly repository = new UserRepository()) {}

	createUser(input: CreateUserInput): string {
		if (input.name.trim().length < 2) {
			throw new Error("Nome invalido");
		}

		if (!input.email.includes("@") || !input.email.includes(".")) {
			throw new Error("Email invalido");
		}

		if (this.repository.findByEmail(input.email)) {
			throw new Error("Email ja cadastrado");
		}

		let trialDays = 7;
		if (input.plan === "pro") {
			trialDays = 14;
		}

		const user: User = {
			id: this.repository.users.length + 1,
			name: input.name.trim(),
			email: input.email.trim().toLowerCase(),
			plan: input.plan,
			active: true,
			trialDays,
		};

		this.repository.save(user);

		console.log("Enviando boas-vindas para " + user.email);

		return "Usuario " + user.name + " criado com " + user.trialDays + " dias";
	}

	countActiveUsers(): number {
		let total = 0;
		for (const user of this.repository.users) {
			if (user.active === true) {
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
console.log("Usuarios ativos:", service.countActiveUsers());
