import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { pool } from "./database/postgres";
import { migrate } from "./database/schema";
import { PostgresUserRepository } from "./repositories/postgres-user-repository";

async function bootstrap() {
	await migrate(pool);

	const userRepository = new PostgresUserRepository(pool);
	const app = createApp(userRepository);

	app.listen(env.PORT, () => {
		logger.info(`API da aula 6 rodando na porta ${env.PORT}`);
	});
}

bootstrap().catch((error) => {
	logger.error("Falha ao iniciar a API", { message: error.message });
	process.exit(1);
});
