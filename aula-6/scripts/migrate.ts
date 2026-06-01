import { closeDatabase, pool } from "../src/database/postgres";
import { migrate } from "../src/database/schema";

async function main() {
	await migrate(pool);
	console.info("Migracao executada com sucesso");
}

main()
	.catch((error) => {
		console.error("Falha ao executar migracao", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await closeDatabase();
	});
