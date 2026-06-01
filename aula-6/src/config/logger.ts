const sensitiveKeys = [
	"password",
	"token",
	"authorization",
	"document",
	"secret",
];

function maskSensitiveValue(key: string, value: unknown) {
	if (
		sensitiveKeys.some((sensitiveKey) =>
			key.toLowerCase().includes(sensitiveKey),
		)
	) {
		return "[redacted]";
	}

	return value;
}

export function sanitizeForLog(input: unknown): unknown {
	if (Array.isArray(input)) {
		return input.map(sanitizeForLog);
	}

	if (input && typeof input === "object") {
		return Object.fromEntries(
			Object.entries(input).map(([key, value]) => [
				key,
				maskSensitiveValue(key, sanitizeForLog(value)),
			]),
		);
	}

	return input;
}

export const logger = {
	info(message: string, meta?: unknown) {
		console.info(message, meta ? sanitizeForLog(meta) : "");
	},
	error(message: string, meta?: unknown) {
		console.error(message, meta ? sanitizeForLog(meta) : "");
	},
};
