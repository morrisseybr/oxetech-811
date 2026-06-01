import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import type { AuthService } from "../services/auth-service";

declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}

export function authenticate(authService: AuthService) {
	return (request: Request, _response: Response, next: NextFunction) => {
		const authorization = request.headers.authorization;

		if (!authorization?.startsWith("Bearer ")) {
			next(new HttpError(401, "Nao autenticado"));
			return;
		}

		const token = authorization.replace("Bearer ", "").trim();
		const payload = authService.verifyToken(token);

		request.userId = payload.userId;
		next();
	};
}
