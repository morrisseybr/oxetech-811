import type { Pool } from "pg";

export async function migrate(pool: Pool) {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS users (
			id uuid PRIMARY KEY,
			name text NOT NULL,
			email text NOT NULL UNIQUE,
			password_hash text NOT NULL,
			role text NOT NULL DEFAULT 'student',
			created_at timestamptz NOT NULL DEFAULT now()
		);
	`);
}
