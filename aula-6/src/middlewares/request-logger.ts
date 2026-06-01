import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

export function requestLogger(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	const startedAt = Date.now();

	response.on("finish", () => {
		logger.info("request", {
			method: request.method,
			path: request.path,
			statusCode: response.statusCode,
			durationMs: Date.now() - startedAt,
		});
	});

	next();
}
