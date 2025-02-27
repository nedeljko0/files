import Router from "@koa/router";
import { Context } from "koa";
import { DocumentService } from "../services/documents";
import { validate } from "../middleware/validate";
import {
	createDocumentSchema,
	updateDocumentSchema,
} from "@files/shared/validators/documents";
import { upload, type File } from "../middleware/upload";
import path from "path";
import fs from "fs";

interface MulterRequest {
	file?: File;
	files?: File[];
}

const router = new Router({ prefix: "/documents" });
const documentService = new DocumentService();

router.post(
	"/",
	upload.single("file"),
	validate(createDocumentSchema),
	async (ctx: Context) => {
		const req = ctx.request as unknown as MulterRequest;

		if (!req.file) {
			ctx.status = 400;
			ctx.body = { error: "File is required" };
			return;
		}

		try {
			const { title, description, folderId } = ctx.state.validatedData;

			ctx.body = await documentService.create(
				title,
				description || null,
				folderId,
				req.file
			);
		} catch (error: any) {
			ctx.status = 400;
			ctx.body = { error: error.message };
		}
	}
);

router.get("/folder/:folderId", async (ctx: Context) => {
	try {
		ctx.body = await documentService.findAll(ctx.params.folderId);
	} catch (error: any) {
		ctx.status = 400;
		ctx.body = { error: error.message };
	}
});

router.get("/:id", async (ctx: Context) => {
	try {
		const document = await documentService.findById(ctx.params.id);
		if (!document) {
			ctx.status = 404;
			ctx.body = { error: "Document not found" };
			return;
		}
		ctx.body = document;
	} catch (error: any) {
		ctx.status = 400;
		ctx.body = { error: error.message };
	}
});

router.put("/:id", validate(updateDocumentSchema), async (ctx: Context) => {
	try {
		const { title, description } = ctx.state.validatedData;
		ctx.body = await documentService.update(ctx.params.id, title, description);
	} catch (error: any) {
		ctx.status = 400;
		ctx.body = { error: error.message };
	}
});

router.delete("/:id", async (ctx: Context) => {
	try {
		await documentService.delete(ctx.params.id);
		ctx.status = 204;
	} catch (error: any) {
		ctx.status = 400;
		ctx.body = { error: error.message };
	}
});

router.post("/:id/versions", upload.single("file"), async (ctx: Context) => {
	const req = ctx.request as unknown as MulterRequest;

	if (!req.file) {
		ctx.status = 400;
		ctx.body = { error: "File is required" };
		return;
	}

	try {
		ctx.body = await documentService.createFileVersion(ctx.params.id, req.file);
	} catch (error: any) {
		ctx.status = 400;
		ctx.body = { error: error.message };
	}
});

router.get("/versions/:versionId/download", async (ctx: Context) => {
	try {
		const version = await documentService.getFileVersion(ctx.params.versionId);
		if (!version) {
			ctx.status = 404;
			ctx.body = { error: "File version not found" };
			return;
		}

		ctx.attachment(version.name);
		ctx.type = path.extname(version.name);
		ctx.body = fs.createReadStream(version.path);
	} catch (error: any) {
		ctx.status = 400;
		ctx.body = { error: error.message };
	}
});

router.get("/:id/download", async (ctx: Context) => {
	try {
		const version = await documentService.getLatestFileVersion(ctx.params.id);
		if (!version) {
			ctx.status = 404;
			ctx.body = { error: "No file versions found for this document" };
			return;
		}

		ctx.attachment(version.name);
		ctx.type = path.extname(version.name);
		ctx.body = fs.createReadStream(version.path);
	} catch (error: any) {
		ctx.status = 400;
		ctx.body = { error: error.message };
	}
});

export default router;
