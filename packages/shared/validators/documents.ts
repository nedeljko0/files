import { z } from "zod";

export const createDocumentBaseSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	folderId: z.string().min(1, "Folder ID is required"),
});

export const createDocumentFormSchema = createDocumentBaseSchema.extend({
	file: z.any(),
});

export type CreateDocumentForm = z.infer<typeof createDocumentFormSchema>;
export type CreateDocumentBase = z.infer<typeof createDocumentBaseSchema>;

export const updateDocumentSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
});

export type UpdateDocumentForm = z.infer<typeof updateDocumentSchema>;

export interface Document {
	id: string;
	title: string;
	description: string | null;
	folderId: string;
	versions: Array<{
		id: string;
		name: string;
		path: string;
		size: number;
		uploadedAt: Date;
		documentId: string;
	}>;
}

export interface UpdateDocumentInput {
	title?: string;
	description?: string | null;
}
