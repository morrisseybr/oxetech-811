import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { type PublicUser, toPublicUser } from "../domain/user";
import { HttpError } from "../errors/http-error";
import type { UserRepository } from "../repositories/user-repository";

export type RegisterUserInput = {
	name: string;
	email: string;
	password: string;
};

export type LoginInput = {
	email: string;
	password: string;
};

export type AuthResult = {
	user: PublicUser;
	token: string;
};

export class AuthService {
	constructor(private readonly userRepository: UserRepository) {}

	async register(input: RegisterUserInput): Promise<AuthResult> {
		const email = input.email.toLowerCase();
		const existingUser = await this.userRepository.findByEmail(email);

		if (existingUser) {
			throw new HttpError(409, "E-mail ja cadastrado");
		}

		const passwordHash = await bcrypt.hash(input.password, 12);
		const user = await this.userRepository.create({
			id: crypto.randomUUID(),
			name: input.name,
			email,
			passwordHash,
			role: "student",
			createdAt: new Date(),
		});

		return {
			user: toPublicUser(user),
			token: this.signToken(user.id),
		};
	}

	async login(input: LoginInput): Promise<AuthResult> {
		const user = await this.userRepository.findByEmail(
			input.email.toLowerCase(),
		);

		if (!user) {
			throw new HttpError(401, "Credenciais invalidas");
		}

		const passwordMatches = await bcrypt.compare(
			input.password,
			user.passwordHash,
		);

		if (!passwordMatches) {
			throw new HttpError(401, "Credenciais invalidas");
		}

		return {
			user: toPublicUser(user),
			token: this.signToken(user.id),
		};
	}

	verifyToken(token: string): { userId: string } {
		try {
			const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;

			if (typeof payload.sub !== "string") {
				throw new HttpError(401, "Token invalido");
			}

			return { userId: payload.sub };
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}

			throw new HttpError(401, "Token invalido");
		}
	}

	private signToken(userId: string) {
		return jwt.sign({}, env.JWT_SECRET, {
			subject: userId,
			expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
		});
	}
}
