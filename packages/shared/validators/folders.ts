import { z } from "zod";

export const createFolderSchema = z.object({
	name: z.string().min(1, "Folder name is required").max(255),
	position: z.number().int().min(0),
});

export const updateFolderPositionSchema = z.object({
	position: z.number().int().min(0),
});

export const updateFolderNameSchema = z.object({
	name: z.string().min(1),
});

export const updateFolderSchema = z
	.object({
		name: z.string().min(1).optional(),
		position: z.number().int().min(0).optional(),
	})
	.refine(
		(data) => {
			return data.name !== undefined || data.position !== undefined;
		},
		{
			message: "At least one field (name or position) must be provided",
		}
	);

export const folderSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	position: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type Folder = z.infer<typeof folderSchema>;
