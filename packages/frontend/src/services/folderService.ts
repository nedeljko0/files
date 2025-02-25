import { Folder, CreateFolderInput } from "@files/shared";

const API_URL = "/api/folders";

export async function getFolders(): Promise<Folder[]> {
	const response = await fetch(API_URL);

	if (!response.ok) {
		throw new Error(`Failed to fetch folders: ${response.statusText}`);
	}

	return response.json();
}

export async function getFolderById(id: string): Promise<Folder> {
	const response = await fetch(`${API_URL}/${id}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch folder: ${response.statusText}`);
	}

	return response.json();
}

export async function createFolder(name: string): Promise<Folder> {
	const folderData: CreateFolderInput = { name };

	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(folderData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to create folder");
	}

	return response.json();
}
