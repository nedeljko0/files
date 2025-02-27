import { useState } from "react";
import { useDocumentsByFolderQuery } from "../services/documentQueries";
import { PlusIcon } from "./icons";
import { DocumentListItem } from "./DocumentListItem";
import CreateDocumentForm from "./CreateDocumentForm";
import { Button } from "@heroui/button";
import { Document } from "@files/shared/validators/documents";

interface Props {
	folderId: string;
	folderName: string;
}

export function DocumentList({ folderId, folderName }: Props) {
	const [showCreateForm, setShowCreateForm] = useState(false);

	const {
		data: documents = [],
		isLoading,
		isError,
		error,
	} = useDocumentsByFolderQuery(folderId) as {
		data: Document[];
		isLoading: boolean;
		isError: boolean;
		error: Error;
	};

	if (isLoading)
		return <div className="p-4 text-gray-500">Loading documents...</div>;
	if (isError)
		return <div className="p-4 text-red-500">Error: {error.message}</div>;

	return (
		<div className="p-4">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-medium text-gray-800">
					{folderName} - Documents
				</h2>
				<Button
					color="primary"
					onPress={() => setShowCreateForm(true)}
					className="p-2 rounded-md text-white hover:bg-primary/90 disabled:bg-primary-disabled"
				>
					<PlusIcon className="h-4 w-4" />
					<span>New Document</span>
				</Button>
			</div>

			{showCreateForm && (
				<CreateDocumentForm
					folderId={folderId}
					onCancel={() => setShowCreateForm(false)}
					onSuccess={() => setShowCreateForm(false)}
				/>
			)}

			{documents.length === 0 && !showCreateForm ? (
				<div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
					<p className="text-gray-500">No documents in this folder yet.</p>
					<Button
						onPress={() => setShowCreateForm(true)}
						className="bg-primary mt-8 p-2 rounded-md text-white hover:bg-primary/90 disabled:bg-primary-disabled"
					>
						Create your first document
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
					{documents.map((document) => (
						<DocumentListItem key={document.id} document={document} />
					))}
				</div>
			)}
		</div>
	);
}
