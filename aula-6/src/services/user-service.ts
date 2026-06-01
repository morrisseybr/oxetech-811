import { type PublicUser, toPublicUser } from "../domain/user";
import { HttpError } from "../errors/http-error";
import type { UserRepository } from "../repositories/user-repository";

export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async getProfile(userId: string): Promise<PublicUser> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new HttpError(404, "Usuario nao encontrado");
		}

		return toPublicUser(user);
	}

	async listUsers(): Promise<PublicUser[]> {
		const users = await this.userRepository.list();
		return users.map(toPublicUser);
	}
}
