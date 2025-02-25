import { z } from "zod";
import type { DefaultState, Context, Next } from "koa";

type ValidatedContext = Context & {
	state: DefaultState & { validatedData: any };
	request: { body: any };
};

export const validate =
	(schema: z.ZodSchema) => async (ctx: ValidatedContext, next: Next) => {
		try {
			const result = schema.safeParse(ctx.request.body);

			if (!result.success) {
				ctx.status = 400;
				ctx.body = { errors: result.error.flatten() };
				return;
			}

			ctx.state.validatedData = result.data;
			await next();
		} catch (error) {
			ctx.status = 500;
			ctx.body = { error: "Internal server error" };
		}
	};
