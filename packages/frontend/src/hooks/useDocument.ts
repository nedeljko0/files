import { useState } from "react";
import {
	useDocumentQuery,
	useUpdateDocumentMutation,
	useDeleteDocumentMutation,
	useUploadFileVersionMutation,
} from "../services/documentQueries";

export function useDocument(documentId: string, onDeleteSuccess?: () => void) {
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [showUploadForm, setShowUploadForm] = useState(false);
	const [file, setFile] = useState<File | null>(null);

	const {
		data: document,
		isLoading,
		isError,
		error,
	} = useDocumentQuery(documentId);
	const { mutate: updateDocument, isPending: isUpdating } =
		useUpdateDocumentMutation(() => {
			setIsEditing(false);
		});
	const { mutate: deleteDocument, isPending: isDeleting } =
		useDeleteDocumentMutation(document?.folderId || "", onDeleteSuccess);
	const { mutate: uploadVersion, isPending: isUploading } =
		useUploadFileVersionMutation(documentId, () => {
			setShowUploadForm(false);
			setFile(null);
		});

	return {
		document,
		isLoading,
		isError,
		error,
		isEditing,
		setIsEditing,
		title,
		setTitle,
		description,
		setDescription,
		showUploadForm,
		setShowUploadForm,
		file,
		setFile,
		updateDocument,
		isUpdating,
		deleteDocument,
		isDeleting,
		uploadVersion,
		isUploading,
	};
}
