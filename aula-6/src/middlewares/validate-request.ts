import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { HttpError } from "../errors/http-error";

export function validateRequest(schema: ZodType) {
	return (request: Request, _response: Response, next: NextFunction) => {
		try {
			const parsed = schema.parse({
				body: request.body,
				params: request.params,
				query: request.query,
			});

			Object.assign(request, parsed);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				next(
					new HttpError(
						400,
						"Requisicao invalida",
						error.issues.map((issue) => ({
							path: issue.path.join("."),
							message: issue.message,
						})),
					),
				);
				return;
			}

			next(error);
		}
	};
}
