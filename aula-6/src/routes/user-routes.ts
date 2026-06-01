import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { authenticate } from "../middlewares/authenticate";
import type { AuthService } from "../services/auth-service";
import type { UserService } from "../services/user-service";

export function createUserRoutes(
	authService: AuthService,
	userService: UserService,
) {
	const routes = Router();
	const controller = new UserController(userService);
	const requireAuth = authenticate(authService);

	routes.get("/me", requireAuth, controller.me);
	routes.get("/users", requireAuth, controller.index);

	return routes;
}
