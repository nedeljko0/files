import {
	Document,
	UpdateDocumentInput
} from "@files/shared/validators/documents";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const DOCUMENTS_ENDPOINT = `${API_URL}/documents`;

export async function getDocumentsByFolder(
	folderId: string
): Promise<Document[]> {
	try {
		const response = await fetch(`${DOCUMENTS_ENDPOINT}/folder/${folderId}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch documents: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		console.error("Error in getDocumentsByFolder:", error);
		throw error;
	}
}

export async function getDocumentById(id: string): Promise<Document> {
	try {
		const response = await fetch(`${DOCUMENTS_ENDPOINT}/${id}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch document: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		console.error(`Error in getDocumentById for id ${id}:`, error);
		throw error;
	}
}

export async function createDocument(data: FormData): Promise<Document> {
	try {
		const response = await fetch(DOCUMENTS_ENDPOINT, {
			method: "POST",
			body: data,
		});

		if (!response.ok) {
			const errorText = await response.text();
			try {
				const errorData = JSON.parse(errorText);
				throw new Error(
					errorData.error || `Failed to create document: ${response.statusText}`
				);
			} catch (e) {
				throw new Error(`Failed to create document: ${response.statusText}`);
			}
		}

		return response.json();
	} catch (error) {
		console.error("Error in createDocument:", error);
		throw error;
	}
}

export async function updateDocument(
	id: string,
	data: UpdateDocumentInput
): Promise<Document> {
	try {
		const response = await fetch(`${DOCUMENTS_ENDPOINT}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.error || `Failed to update document: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error("Error in updateDocument:", error);
		throw error;
	}
}

export async function deleteDocument(id: string): Promise<void> {
	try {
		const response = await fetch(`${DOCUMENTS_ENDPOINT}/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error(`Failed to delete document: ${response.statusText}`);
		}
	} catch (error) {
		console.error("Error in deleteDocument:", error);
		throw error;
	}
}

export async function uploadFileVersion(
	documentId: string,
	file: File
): Promise<any> {
	const formData = new FormData();
	formData.append("file", file);

	try {
		const response = await fetch(
			`${DOCUMENTS_ENDPOINT}/${documentId}/versions`,
			{
				method: "POST",
				body: formData,
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.error ||
					`Failed to upload file version: ${response.statusText}`
			);
		}

		return response.json();
	} catch (error) {
		console.error("Error in uploadFileVersion:", error);
		throw error;
	}
}

export function getFileDownloadUrl(versionId: string): string {
	return `${DOCUMENTS_ENDPOINT}/versions/${versionId}/download`;
}

export function getLatestFileDownloadUrl(documentId: string): string {
	return `${DOCUMENTS_ENDPOINT}/${documentId}/download`;
}
