import { Folder, CreateFolderInput, UpdateFolderInput } from "@files/shared";

// Update this URL to match your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || "/api";
console.log("API_URL - ", API_URL);
const FOLDERS_ENDPOINT = `${API_URL}/folders`;

export async function getFolders(): Promise<Folder[]> {
	try {
		const response = await fetch(FOLDERS_ENDPOINT);

		if (!response.ok) {
			throw new Error(`Failed to fetch folders: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		console.error("Error in getFolders:", error);
		throw error;
	}
}

export async function getFolderById(id: string): Promise<Folder> {
	try {
		const response = await fetch(`${FOLDERS_ENDPOINT}/${id}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch folder: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		console.error(`Error in getFolderById for id ${id}:`, error);
		throw error;
	}
}

export async function createFolder(name: string): Promise<Folder> {
	const folderData: CreateFolderInput = { name };

	try {
		const response = await fetch(FOLDERS_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(folderData),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.error || `Failed to create folder: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error("Error in createFolder:", error);
		throw error;
	}
}

export async function deleteFolder(id: string): Promise<void> {
	try {
		const response = await fetch(`${FOLDERS_ENDPOINT}/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error(`Failed to delete folder: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		console.error("Error in deleteFolder:", error);
		throw error;
	}
}

export async function updateFolder(id: string, name: string): Promise<Folder> {
	const folderData: UpdateFolderInput = { name };

	try {
		const response = await fetch(`${FOLDERS_ENDPOINT}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(folderData),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.error || `Failed to update folder: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error("Error in updateFolder:", error);
		throw error;
	}
}
