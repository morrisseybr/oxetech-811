import type { Pool } from "pg";
import type { User, UserRole } from "../domain/user";
import type { CreateUserData, UserRepository } from "./user-repository";

type UserRow = {
	id: string;
	name: string;
	email: string;
	password_hash: string;
	role: UserRole;
	created_at: Date;
};

function mapRowToUser(row: UserRow): User {
	return {
		id: row.id,
		name: row.name,
		email: row.email,
		passwordHash: row.password_hash,
		role: row.role,
		createdAt: row.created_at,
	};
}

export class PostgresUserRepository implements UserRepository {
	constructor(private readonly pool: Pool) {}

	async create(data: CreateUserData): Promise<User> {
		const result = await this.pool.query<UserRow>(
			`INSERT INTO users (id, name, email, password_hash, role, created_at)
			 VALUES ($1, $2, $3, $4, $5, $6)
			 RETURNING id, name, email, password_hash, role, created_at`,
			[
				data.id,
				data.name,
				data.email,
				data.passwordHash,
				data.role,
				data.createdAt,
			],
		);

		return mapRowToUser(result.rows[0]);
	}

	async findByEmail(email: string): Promise<User | null> {
		const result = await this.pool.query<UserRow>(
			"SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1",
			[email.toLowerCase()],
		);

		return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
	}

	async findById(id: string): Promise<User | null> {
		const result = await this.pool.query<UserRow>(
			"SELECT id, name, email, password_hash, role, created_at FROM users WHERE id = $1",
			[id],
		);

		return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
	}

	async list(): Promise<User[]> {
		const result = await this.pool.query<UserRow>(
			"SELECT id, name, email, password_hash, role, created_at FROM users ORDER BY created_at ASC",
		);

		return result.rows.map(mapRowToUser);
	}
}
