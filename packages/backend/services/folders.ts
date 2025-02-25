import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
}
