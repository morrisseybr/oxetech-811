import bcrypt from "bcryptjs";
import { closeDatabase, pool } from "../src/database/postgres";
import { migrate } from "../src/database/schema";

async function main() {
	await migrate(pool);

	const passwordHash = await bcrypt.hash("senha-aula-6", 12);

	await pool.query(
		`INSERT INTO users (id, name, email, password_hash, role)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (email) DO NOTHING`,
		[
			crypto.randomUUID(),
			"Aluno Aula 6",
			"aluno@aula6.local",
			passwordHash,
			"student",
		],
	);

	console.info("Seed executado com sucesso");
	console.info("Login de exemplo: aluno@aula6.local / senha-aula-6");
}

main()
	.catch((error) => {
		console.error("Falha ao executar seed", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await closeDatabase();
	});
