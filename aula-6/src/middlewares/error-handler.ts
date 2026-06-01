import type { ErrorRequestHandler } from "express";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { HttpError } from "../errors/http-error";

export const errorHandler: ErrorRequestHandler = (
	error,
	_request,
	response,
	_next,
) => {
	if (error instanceof HttpError) {
		response.status(error.statusCode).json({
			message: error.message,
			details: error.details,
		});
		return;
	}

	logger.error("Erro inesperado", {
		message: error.message,
		stack: error.stack,
	});

	response.status(500).json({
		message: "Erro interno",
		...(env.NODE_ENV === "development" ? { detail: error.message } : {}),
	});
};
