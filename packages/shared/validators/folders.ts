import { z } from "zod";

export const createFolderSchema = z.object({
	name: z.string().min(1, "Folder name is required").max(255),
});

export const folderSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type Folder = z.infer<typeof folderSchema>;
