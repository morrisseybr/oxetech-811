import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
	connectionString: env.DATABASE_URL,
});

export async function closeDatabase() {
	await pool.end();
}
