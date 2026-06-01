import type { Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import type { UserService } from "../services/user-service";

export class UserController {
	constructor(private readonly userService: UserService) {}

	me = async (request: Request, response: Response) => {
		console.log("UserController.me called with userId:", request.userId);
		if (!request.userId) {
			throw new HttpError(401, "Nao autenticado");
		}

		const user = await this.userService.getProfile(request.userId);
		response.status(200).json({ user });
	};

	index = async (_request: Request, response: Response) => {
		const users = await this.userService.listUsers();
		response.status(200).json({ users });
	};
}
