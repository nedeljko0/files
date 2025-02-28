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
	try {
		const { name, position } = ctx.state.validatedData;
		ctx.body = await folderService.create(name, position);
	} catch (error) {
		ctx.status = 400;
		ctx.body = {
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
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
	try {
		const { name, position } = ctx.state.validatedData;
		ctx.body = await folderService.update(ctx.params.id, name, position);
	} catch (error) {
		ctx.status = 400;
		ctx.body = {
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
});

export default router;
