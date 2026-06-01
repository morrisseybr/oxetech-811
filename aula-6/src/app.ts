import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error-handler";
import { requestLogger } from "./middlewares/request-logger";
import type { UserRepository } from "./repositories/user-repository";
import { createRoutes } from "./routes";
import { AuthService } from "./services/auth-service";
import { UserService } from "./services/user-service";

export function createApp(userRepository: UserRepository) {
	const app = express();
	const authService = new AuthService(userRepository);
	const userService = new UserService(userRepository);

	app.use(helmet());
	app.use(cors());
	app.use(express.json({ limit: "1mb" }));
	app.use(requestLogger);

	app.use("/api", createRoutes(authService, userService));
	app.use(errorHandler);

	return app;
}
