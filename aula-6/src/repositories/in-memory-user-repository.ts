import type { User } from "../domain/user";
import type { CreateUserData, UserRepository } from "./user-repository";

export class InMemoryUserRepository implements UserRepository {
	private readonly users = new Map<string, User>();

	async create(data: CreateUserData): Promise<User> {
		const user = { ...data };
		this.users.set(user.id, user);
		return user;
	}

	async findByEmail(email: string): Promise<User | null> {
		const normalizedEmail = email.toLowerCase();
		return (
			[...this.users.values()].find((user) => user.email === normalizedEmail) ??
			null
		);
	}

	async findById(id: string): Promise<User | null> {
		return this.users.get(id) ?? null;
	}

	async list(): Promise<User[]> {
		return [...this.users.values()].sort(
			(left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
		);
	}
}
