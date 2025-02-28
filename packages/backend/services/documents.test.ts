import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { DocumentService } from "./documents";
import { prisma as prismaMock } from "./prisma";

jest.mock("./prisma");

describe("DocumentService", () => {
	let documentService: DocumentService;

	beforeEach(() => {
		jest.clearAllMocks();
		documentService = new DocumentService();
	});

	describe("create", () => {
		it("should create a document with file version", async () => {
			const mockFile: Express.Multer.File = {
				path: "/path/to/file",
				originalname: "test.pdf",
				mimetype: "application/pdf",
				size: 1024,
				filename: "test.pdf",
				destination: "/uploads",
				buffer: Buffer.from([]),
				encoding: "7bit",
				fieldname: "file",
				stream: {} as any, 
			};

			const mockDocument = {
				id: "123",
				title: "Test Doc",
				description: "Test Description",
				position: 1,
				mimeType: "application/pdf",
				folderId: "456",
				createdAt: new Date(),
				updatedAt: new Date(),
				versions: [],
			};

			jest.mocked(prismaMock.document.create).mockResolvedValue(mockDocument);
			jest
				.mocked(prismaMock.document.findUnique)
				.mockResolvedValue(mockDocument);
			jest.mocked(prismaMock.fileVersion.create).mockResolvedValue({
				id: "789",
				documentId: "123",
				path: mockFile.path,
				name: mockFile.originalname,
				size: mockFile.size,
				uploadedAt: new Date(),
			});

			const result = await documentService.create(
				"Test Doc",
				"Test Description",
				"456",
				mockFile
			);

			expect(prismaMock.document.create).toHaveBeenCalledWith({
				data: {
					title: "Test Doc",
					description: "Test Description",
					mimeType: "application/pdf",
					folderId: "456",
				},
			});

			expect(result).toEqual(mockDocument);
		});
	});

	describe("findAll", () => {
		it("should return all documents in a folder", async () => {
			const mockDocuments = [
				{
					id: "123",
					title: "Test Doc",
					description: "Test Description",
					mimeType: "application/pdf",
					folderId: "456",
					createdAt: new Date(),
					updatedAt: new Date(),
					versions: [],
				},
			];

			(prismaMock as any).document.findMany.mockResolvedValue(mockDocuments);

			const result = await documentService.findAll("456");

			expect(prismaMock.document.findMany).toHaveBeenCalledWith({
				where: { folderId: "456" },
				include: {
					versions: {
						orderBy: { uploadedAt: "desc" },
					},
				},
			});

			expect(result).toEqual(mockDocuments);
		});
	});
});
