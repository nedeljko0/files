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

			if (onSuccess) {
				onSuccess(newDocument);
			}
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

			if (onSuccess) {
				onSuccess(updatedDocument);
			}
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["documents", folderId] });

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

			if (onSuccess) {
				onSuccess(version);
			}
		},
	});
}
