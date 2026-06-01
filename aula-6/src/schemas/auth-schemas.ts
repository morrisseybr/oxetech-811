import { z } from "zod";

export const registerUserSchema = z.object({
	body: z.object({
		name: z.string().trim().min(2).max(80),
		email: z.email().toLowerCase(),
		password: z.string().min(8).max(72),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z.email().toLowerCase(),
		password: z.string().min(8).max(72),
	}),
});
