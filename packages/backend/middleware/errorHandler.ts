import { Context, Next } from "koa";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface ErrorResponse {
	error: string;
	details?: unknown;
	status?: number;
}

export async function errorHandler(ctx: Context, next: Next) {
	try {
		await next();
	} catch (error: unknown) {
		let response: ErrorResponse = {
			error: "Internal Server Error",
		};

		// Handle known error types
		if (error instanceof ZodError) {
			response = {
				error: "Validation Error",
				details: error.errors,
				status: 400,
			};
		} else if (error instanceof PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2002":
					response = {
						error: "Unique constraint violation",
						status: 409,
					};
					break;
				case "P2025":
					response = {
						error: "Record not found",
						status: 404,
					};
					break;
				default:
					response = {
						error: "Database error",
						status: 500,
					};
			}
		} else if (error instanceof Error) {
			response = {
				error: error.message,
				status: (error as any).status || 500,
			};
		}

		ctx.status = response.status || 500;
		ctx.body = {
			error: response.error,
			...(typeof response.details === "object" &&
				response.details !== null && { details: response.details }),
		};

		// Log server errors
		if (ctx.status >= 500) {
			console.error("Server Error:", error);
		}
	}
}
