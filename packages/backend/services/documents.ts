import { prisma } from "./prisma";
import fs from "fs";
import { type File } from "../middleware/upload";

export class DocumentService {
	async create(
		title: string,
		description: string | null,
		folderId: string,
		file: File
	) {
		const document = await prisma.document.create({
			data: {
				title,
				description,
				mimeType: file.mimetype,
				folderId,
			},
		});

		await this.createFileVersion(document.id, file);

		return this.findById(document.id);
	}

	async findAll(folderId: string) {
		return prisma.document.findMany({
			where: { folderId },
			include: {
				versions: {
					orderBy: { uploadedAt: "desc" },
				},
			},
		});
	}

	async findById(id: string) {
		return prisma.document.findUnique({
			where: { id },
			include: {
				versions: {
					orderBy: { uploadedAt: "desc" },
				},
			},
		});
	}

	async update(id: string, title: string, description: string | null) {
		const document = await this.findById(id);
		if (!document) throw new Error(`Document not found: ${id}`);

		return prisma.document.update({
			where: { id },
			data: { title, description },
			include: {
				versions: {
					orderBy: { uploadedAt: "desc" },
				},
			},
		});
	}

	async delete(id: string) {
		const document = await this.findById(id);
		if (!document) throw new Error(`Document not found: ${id}`);

		
		await prisma.document.delete({
			where: { id },
		});

	
		for (const version of document.versions) {
			try {
				fs.unlinkSync(version.path);
			} catch (error) {
				console.error(`Failed to delete file: ${version.path}`, error);
			}
		}
	}

	async createFileVersion(documentId: string, file: File) {
		const document = await this.findById(documentId);
		if (!document) throw new Error(`Document not found: ${documentId}`);

		return prisma.fileVersion.create({
			data: {
				documentId,
				path: file.path,
				name: file.originalname,
				size: file.size,
			},
		});
	}

	async getFileVersion(versionId: string) {
		return prisma.fileVersion.findUnique({
			where: { id: versionId },
		});
	}

	async getLatestFileVersion(documentId: string) {
		return prisma.fileVersion.findFirst({
			where: { documentId },
			orderBy: { uploadedAt: "desc" },
		});
	}
}
