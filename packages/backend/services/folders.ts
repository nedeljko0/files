import { prisma } from "./prisma";

export class FolderService {
	async create(name: string) {
		return prisma.folder.create({
			data: { name },
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

	async update(id: string, name: string) {
		const folder = await this.findById(id);
		if (!folder) throw new Error(`Folder not found: ${id}`);

		await prisma.folder.update({
			where: { id },
			data: { name },
		});
	}
}
