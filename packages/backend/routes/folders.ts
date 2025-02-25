import Router from "@koa/router";
import { Context } from "koa";
import { FolderService } from "../services/folders";
import { validate } from "../middlewares/validate";
import { createFolderSchema } from "@files/shared/validators/folders";

const router = new Router({ prefix: "/folders" });
const folderService = new FolderService();

router.post("/", validate(createFolderSchema), async (ctx: Context) => {
	const { name } = ctx.state.validatedData;
	ctx.body = await folderService.create(name);
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

export default router;
