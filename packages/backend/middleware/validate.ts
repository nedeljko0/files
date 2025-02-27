import { z } from "zod";
import type { DefaultState, Context, Next } from "koa";

type ValidatedContext = Context & {
	state: DefaultState & { validatedData: any };
	request: { body: any };
};

export const validate = (schema: z.Schema) => {
	return async (ctx: ValidatedContext, next: Next) => {
		try {
			const result = await schema.parseAsync(ctx.request.body);
			ctx.state.validatedData = result;
			await next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				ctx.status = 400;
				ctx.body = {
					error: "Validation failed",
					details: error.errors,
				};
			} else {
				ctx.status = 500;
				ctx.body = { error: "Internal server error" };
				console.error(error);
			}
		}
	};
};
