import multer from "@koa/multer";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export interface File {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	size: number;
	destination: string;
	filename: string;
	path: string;
	buffer: Buffer;
	stream: Readable;
}

const uploadDir = path.resolve("./uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req: any, _file: any, cb) => cb(null, uploadDir),
	filename: (_req: any, file: any, cb) => {
		const fileExt = path.extname(file.originalname);
		const fileName = `${Date.now()}-${Math.random()
			.toString(36)
			.substring(2, 15)}${fileExt}`;
		cb(null, fileName);
	},
});

export const upload = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
	fileFilter: (
		_req: any,
		file: any,
		cb: (error: Error | null, acceptFile: boolean) => void
	) => {
		const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
		if (!allowedTypes.includes(file.mimetype)) {
			cb(new Error("Invalid file type"), false);
			return;
		}
		cb(null, true);
	},
});
