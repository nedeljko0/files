import { Folder } from "@files/shared/validators/folders";
import { prisma } from "./prisma";
import fs from "fs";

type FolderWithNullablePosition = Omit<Folder, "position"> & {
	position: number | null;
};

export class FolderService {
	async create(name: string, position: number) {
		return prisma.folder.create({
			data: { name, position },
		});
	}

	async findAll() {
		return prisma.folder.findMany({
			include: { documents: true },
		});
	}

	async findById(id: string) {
		return prisma.folder.findUnique({
			where: { id },
			include: { documents: true },
		});
	}

	async delete(id: string) {
		const folder = await this.findById(id);
		if (!folder) throw new Error(`Folder not found: ${id}`);

		// Get all documents in the folder with their versions
		const documents = await prisma.document.findMany({
			where: { folderId: id },
			include: { versions: true },
		});

		// Delete all associated file versions first
		for (const document of documents) {
			for (const version of document.versions) {
				try {
					fs.unlinkSync(version.path);
				} catch (error) {
					console.error(`Failed to delete file: ${version.path}`, error);
				}
			}
		}

		await prisma.folder.delete({
			where: { id },
		});
	}

	async update(id: string, name?: string, position?: number) {
		const folder = await this.findById(id);
		if (!folder) throw new Error(`Folder not found: ${id}`);

		const updateData: any = {};
		if (name !== undefined) updateData.name = name;

		if (position !== undefined) {
			// Get all folders sorted by position
			const allFolders = await prisma.folder.findMany({
				orderBy: { position: "asc" },
			});

			const currentIndex = allFolders.findIndex(
				(f: { id: string }) => f.id === id
			);
			if (currentIndex === -1) return folder;

			// Remove folder from current position
			allFolders.splice(currentIndex, 1);
			// Insert folder at new position
			allFolders.splice(position, 0, folder);

			// Update all positions in a transaction
			await prisma.$transaction(
				allFolders.map((folder: FolderWithNullablePosition, index: number) =>
					prisma.folder.update({
						where: { id: folder.id },
						data: { position: index },
					})
				)
			);

			updateData.position = position;
		}

		return await prisma.folder.findUnique({
			where: { id },
			include: { documents: true },
		});
	}
}
