import { Router } from "express";
import { healthController } from "../controllers/health-controller";
import type { AuthService } from "../services/auth-service";
import type { UserService } from "../services/user-service";
import { createAuthRoutes } from "./auth-routes";
import { createUserRoutes } from "./user-routes";

export function createRoutes(
	authService: AuthService,
	userService: UserService,
) {
	const routes = Router();

	routes.get("/health", healthController);
	routes.use("/auth", createAuthRoutes(authService));
	routes.use(createUserRoutes(authService, userService));

	return routes;
}
