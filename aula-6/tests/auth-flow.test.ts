import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { InMemoryUserRepository } from "../src/repositories/in-memory-user-repository";

function makeApp() {
	return createApp(new InMemoryUserRepository());
}

describe("fluxo de autenticacao", () => {
	it("registra, autentica e acessa perfil", async () => {
		const app = makeApp();

		const registerResponse = await request(app)
			.post("/api/auth/register")
			.send({
				name: "Maria Silva",
				email: "maria@example.com",
				password: "senha-segura",
			});

		expect(registerResponse.status).toBe(201);
		expect(registerResponse.body.user.email).toBe("maria@example.com");
		expect(registerResponse.body.user.passwordHash).toBeUndefined();
		expect(registerResponse.body.token).toEqual(expect.any(String));

		const profileResponse = await request(app)
			.get("/api/me")
			.set("Authorization", `Bearer ${registerResponse.body.token}`);

		expect(profileResponse.status).toBe(200);
		expect(profileResponse.body.user.email).toBe("maria@example.com");
	});

	it("recusa cadastro invalido", async () => {
		const app = makeApp();

		const response = await request(app).post("/api/auth/register").send({
			name: "M",
			email: "email-invalido",
			password: "curta",
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Requisicao invalida");
	});

	it("recusa rota protegida sem token", async () => {
		const app = makeApp();

		const response = await request(app).get("/api/me");

		expect(response.status).toBe(401);
		expect(response.body.message).toBe("Nao autenticado");
	});
});
