export type UserRole = "student" | "admin";

export type User = {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	role: UserRole;
	createdAt: Date;
};

export type PublicUser = Pick<
	User,
	"id" | "name" | "email" | "role" | "createdAt"
>;

export function toPublicUser(user: User): PublicUser {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		createdAt: user.createdAt,
	};
}
