import type { Request, Response } from "express";
import type { AuthService } from "../services/auth-service";

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	register = async (request: Request, response: Response) => {
		const result = await this.authService.register(request.body);
		response.status(201).json(result);
	};

	login = async (request: Request, response: Response) => {
		const result = await this.authService.login(request.body);
		response.status(200).json(result);
	};
}
