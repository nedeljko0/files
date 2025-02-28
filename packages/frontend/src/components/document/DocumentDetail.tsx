import { useState } from "react";
import {
	useDocumentQuery,
	useUploadFileVersionMutation,
	useUpdateDocumentMutation,
	useDeleteDocumentMutation,
} from "../../services/documentQueries";
import { Button } from "@heroui/button";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentEditForm } from "./DocumentEditForm";
import { DocumentVersions } from "./DocumentVersions";
import { VersionUploadForm } from "./VersionUploadForm";
import { UpdateDocumentForm } from "@files/shared/validators/documents";
import { Document } from "@files/shared/validators/documents";
import { BackArrowIcon } from "../icons";
import { useNavigate } from "react-router-dom";

interface Props {
	documentId: string;
	onDelete?: () => void;
}

export function DocumentDetail({ documentId, onDelete }: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const [showUploadForm, setShowUploadForm] = useState(false);
	const navigate = useNavigate();

	const {
		data: document,
		isLoading,
		isError,
		error,
	} = useDocumentQuery(documentId) as {
		data: Document | undefined;
		isLoading: boolean;
		isError: boolean;
		error: Error;
	};

	const { mutate: updateDocument, isPending: isUpdating } =
		useUpdateDocumentMutation(() => {
			setIsEditing(false);
		});
	const { mutate: deleteDocument, isPending: isDeleting } =
		useDeleteDocumentMutation(document?.folderId || "", onDelete);
	const { mutate: uploadVersion, isPending: isUploading } =
		useUploadFileVersionMutation(documentId, () => {
			setShowUploadForm(false);
		});

	if (isLoading)
		return <div className="p-4 text-gray-500">Loading document...</div>;
	if (isError)
		return <div className="p-4 text-red-500">Error: {error.message}</div>;
	if (!document)
		return <div className="p-4 text-gray-500">Document not found</div>;

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleUpdateSubmit = (data: UpdateDocumentForm) => {
		updateDocument({
			id: document.id,
			data: {
				title: data.title,
				description: data.description ?? null,
			},
		});
	};

	const handleDeleteClick = () => {
		if (window.confirm("Are you sure you want to delete this document?")) {
			deleteDocument(document.id);
		}
	};

	const handleUploadSubmit = (file: File) => {
		uploadVersion(file);
	};

	return (
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
			<div className="p-4 border-b border-gray-200">
				<Button
					onPress={() => navigate(`/folder/${document.folderId}`)}
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
				>
					<BackArrowIcon className="w-5 h-5" />
					<span>Back to folder</span>
				</Button>
			</div>
			<div className="p-6">
				{isEditing ? (
					<DocumentEditForm
						documentId={document.id}
						initialTitle={document.title}
						initialDescription={document.description || ""}
						onSubmit={handleUpdateSubmit}
						onCancel={() => setIsEditing(false)}
						isUpdating={isUpdating}
					/>
				) : (
					<DocumentHeader
						document={document}
						onEdit={handleEditClick}
						onDelete={handleDeleteClick}
						isDeleting={isDeleting}
					/>
				)}

				<div className="mb-6">
					<Button
						onPress={() => setShowUploadForm(!showUploadForm)}
						className="flex items-center p-2 border rounded-md hover:bg-primary hover:text-white"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="h-5 w-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
							/>
						</svg>
						<span>Upload New Version</span>
					</Button>

					{showUploadForm && (
						<VersionUploadForm
							onSubmit={handleUploadSubmit}
							onCancel={() => setShowUploadForm(false)}
							isUploading={isUploading}
						/>
					)}
				</div>

				<div>
					<h2 className="text-lg font-medium text-gray-800 mb-4">
						File Versions
					</h2>
					<DocumentVersions versions={document.versions} />
				</div>
			</div>
		</div>
	);
}
