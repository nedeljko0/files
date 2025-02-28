import Router from "@koa/router";
import { Context } from "koa";
import { FolderService } from "../services/folders";
import { validate } from "../middleware/validate";
import {
	createFolderSchema,
	updateFolderSchema,
} from "@files/shared/validators/folders";

const router = new Router({ prefix: "/folders" });
const folderService = new FolderService();

router.post("/", validate(createFolderSchema), async (ctx: Context) => {
	const { name, position } = ctx.state.validatedData;
	ctx.body = await folderService.create(name, position);
});

router.get("/", async (ctx: Context) => {
	ctx.body = await folderService.findAll();
});

router.get("/:id", async (ctx: Context) => {
	const folder = await folderService.findById(ctx.params.id);
	if (!folder) {
		ctx.status = 404;
		return;
	}
	ctx.body = folder;
});

router.delete("/:id", async (ctx: Context) => {
	await folderService.delete(ctx.params.id);
	ctx.status = 204;
});

router.put("/:id", validate(updateFolderSchema), async (ctx: Context) => {
	const rawBody = await ctx.request.body;

	try {
		const parseResult = updateFolderSchema.safeParse(rawBody);

		if (!parseResult.success) {
			console.error("Validation failed:", parseResult.error);
			ctx.status = 400;
			ctx.body = { error: "Validation failed", details: parseResult.error };
			return;
		}

		const updatedFolder = await folderService.update(
			ctx.params.id,
			parseResult.data.name,
			parseResult.data.position
		);

		ctx.body = updatedFolder;
		ctx.status = 200;
	} catch (error: unknown) {
		console.error("Update error:", error);
		ctx.status = 400;
		ctx.body = {
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
});

export default router;
