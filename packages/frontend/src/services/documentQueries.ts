import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document } from "@files/shared";
import {
	getDocumentsByFolder,
	getDocumentById,
	createDocument,
	updateDocument,
	deleteDocument,
	uploadFileVersion,
} from "./document";
import { showAlert } from "../utils/alerts";

export function useDocumentsByFolderQuery(folderId: string) {
	return useQuery({
		queryKey: ["documents", folderId],
		queryFn: () => getDocumentsByFolder(folderId),
		enabled: !!folderId,
	});
}

export function useDocumentQuery(id: string) {
	return useQuery({
		queryKey: ["document", id],
		queryFn: () => getDocumentById(id),
		enabled: !!id,
	});
}

export function useCreateDocumentMutation(
	onSuccess?: (newDocument: Document) => void
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createDocument,
		onSuccess: (newDocument) => {
			queryClient.invalidateQueries({
				queryKey: ["documents", newDocument.folderId],
			});
			showAlert("Document created successfully");
			if (onSuccess) {
				onSuccess(newDocument);
			}
		},
		onError: (error) => {
			showAlert("Failed to create document", true);
			console.error("Error creating document:", error);
		},
	});
}

export function useUpdateDocumentMutation(
	onSuccess?: (updatedDocument: Document) => void
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			updateDocument(id, data),
		onSuccess: (updatedDocument) => {
			queryClient.invalidateQueries({
				queryKey: ["document", updatedDocument.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["documents", updatedDocument.folderId],
			});
			showAlert("Document updated successfully");
			if (onSuccess) {
				onSuccess(updatedDocument);
			}
		},
		onError: (error) => {
			showAlert("Failed to update document", true);
			console.error("Error updating document:", error);
		},
	});
}

export function useDeleteDocumentMutation(
	folderId: string,
	onSuccess?: () => void
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteDocument,
		onMutate: async (documentId) => {
			await queryClient.cancelQueries({ queryKey: ["documents", folderId] });
			const previousDocuments = queryClient.getQueryData<Document[]>([
				"documents",
				folderId,
			]);

			if (previousDocuments) {
				queryClient.setQueryData(
					["documents", folderId],
					previousDocuments.filter((doc) => doc.id !== documentId)
				);
			}

			return { previousDocuments };
		},
		onError: (err, _documentId, context) => {
			if (context?.previousDocuments) {
				queryClient.setQueryData(
					["documents", folderId],
					context.previousDocuments
				);
			}
			showAlert("Failed to delete document", true);
			console.error("Error deleting document:", err);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["documents", folderId] });
			showAlert("Document deleted successfully");
			if (onSuccess) {
				onSuccess();
			}
		},
	});
}

export function useUploadFileVersionMutation(
	documentId: string,
	onSuccess?: (version: any) => void
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (file: File) => uploadFileVersion(documentId, file),
		onSuccess: (version) => {
			queryClient.invalidateQueries({ queryKey: ["document", documentId] });
			showAlert("File version uploaded successfully");
			if (onSuccess) {
				onSuccess(version);
			}
		},
		onError: (error) => {
			showAlert("Failed to upload file version", true);
			console.error("Error uploading file version:", error);
		},
	});
}
