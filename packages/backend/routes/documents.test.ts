import {
	jest,
	describe,
	it,
	expect,
	beforeAll,
	beforeEach,
} from "@jest/globals";
import request from "supertest";
import Koa from "koa";
import documentRoutes from "./documents";
import { prisma } from "../services/prisma";
import { PrismaClient } from "@prisma/client";

jest.mock("../services/prisma");

const prismaMock = prisma as jest.Mocked<PrismaClient>;

describe("Document Routes", () => {
	let app: Koa;

	beforeAll(() => {
		app = new Koa();
		app.use(documentRoutes.routes());
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("GET /documents/folder/:folderId", () => {
		it("should return empty array when folder has no documents", async () => {
			prismaMock.document.findMany.mockResolvedValue([]);

			const response = await request(app.callback())
				.get("/documents/folder/123")
				.expect(200);

			expect(response.body).toEqual([]);
		});

		it("should return documents in folder", async () => {
			const mockDocument = {
				id: "123",
				title: "Test Document",
				description: null,
				mimeType: "application/pdf",
				folderId: "456",
				createdAt: new Date(),
				updatedAt: new Date(),
				versions: [],
			};

			prismaMock.document.findMany.mockResolvedValue([mockDocument]);

			const response = await request(app.callback())
				.get("/documents/folder/456")
				.expect(200);

			expect(response.body).toHaveLength(1);
			expect(response.body[0].id).toBe(mockDocument.id);
		});
	});
});
