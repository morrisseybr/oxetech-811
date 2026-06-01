import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { validateRequest } from "../middlewares/validate-request";
import { loginSchema, registerUserSchema } from "../schemas/auth-schemas";
import type { AuthService } from "../services/auth-service";

export function createAuthRoutes(authService: AuthService) {
	const routes = Router();
	const controller = new AuthController(authService);

	routes.post(
		"/register",
		validateRequest(registerUserSchema),
		controller.register,
	);
	routes.post("/login", validateRequest(loginSchema), controller.login);

	return routes;
}
