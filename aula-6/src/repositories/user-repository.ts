import type { User } from "../domain/user";

export type CreateUserData = Pick<
	User,
	"id" | "name" | "email" | "passwordHash" | "role" | "createdAt"
>;

export interface UserRepository {
	create(data: CreateUserData): Promise<User>;
	findByEmail(email: string): Promise<User | null>;
	findById(id: string): Promise<User | null>;
	list(): Promise<User[]>;
}
