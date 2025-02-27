import { z } from "zod";
import { File } from "node:buffer";

export const createDocumentSchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	description: z.string().nullable().optional(),
	folderId: z.string().uuid("Invalid folder ID"),
});

export const createDocumentFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	file: z.instanceof(File, { message: "File is required" }),
	folderId: z.string(),
});

export const updateDocumentSchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	description: z.string().nullable().optional(),
});

export const documentSchema = z
	.object({
		id: z.string().uuid(),
		title: z.string(),
		description: z.string().nullable(),
		mimeType: z.string(),
		folderId: z.string().uuid(),
		createdAt: z.date(),
		updatedAt: z.date(),
		versions: z.array(
			z.object({
				id: z.string().uuid(),
				documentId: z.string().uuid(),
				path: z.string(),
				name: z.string(),
				size: z.number(),
				uploadedAt: z.date(),
			})
		),
	})
	.strict();

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type Document = z.infer<typeof documentSchema>;

export type CreateDocumentForm = z.infer<typeof createDocumentFormSchema>;
export type UpdateDocumentForm = z.infer<typeof updateDocumentSchema>;
