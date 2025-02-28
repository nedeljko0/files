import { prisma } from "./prisma";

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

			const currentIndex = allFolders.findIndex((f) => f.id === id);
			if (currentIndex === -1) return folder;

			// Remove folder from current position
			allFolders.splice(currentIndex, 1);
			// Insert folder at new position
			allFolders.splice(position, 0, folder);

			// Update all positions in a transaction
			await prisma.$transaction(
				allFolders.map((folder, index) =>
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
