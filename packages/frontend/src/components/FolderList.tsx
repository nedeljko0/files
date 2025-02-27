import { useState } from "react";
import { FolderListItem } from "./FolderListItem";
import CreateFolderForm from "./CreateFolderForm";
import { PlusIcon } from "./icons";
import {
	useFoldersQuery,
	useCreateFolderMutation,
	useDeleteFolderMutation,
} from "../services/folderQueries";
import { Folder } from "@files/shared/validators/folders";

export function FolderList() {
	const [isCreating, setIsCreating] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);

	const { data: folders = [], isLoading, isError, error } = useFoldersQuery();

	const { mutate: deleteFolderMutate, isPending: isDeleting } =
		useDeleteFolderMutation();

	const { mutate: createFolderMutate } = useCreateFolderMutation(() => {
		setShowCreateForm(false);
	});

	const handleCreateFolder = async (folderName: string) => {
		if (!folderName.trim()) return false;

		try {
			setIsCreating(true);
			createFolderMutate(folderName);
			return true;
		} catch (err) {
			console.error("Failed to create folder:", err);
			return false;
		} finally {
			setIsCreating(false);
		}
	};

	const handleDeleteFolder = async (folderId: string) => {
		if (isDeleting) return;
		deleteFolderMutate(folderId);
	};

	if (isLoading)
		return <div className="p-4 text-gray-500">Loading folders...</div>;
	if (isError)
		return <div className="p-4 text-red-500">Error: {error.message}</div>;

	return (
		<div className="bg-gray-50 h-full min-h-screen p-4 border-r border-gray-200">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg font-medium text-gray-800">Folders</h2>
				<button
					onClick={() => setShowCreateForm(true)}
					className="text-gray-500 hover:text-gray-800 transition-colors"
					aria-label="Add new folder"
				>
					<PlusIcon className="h-5 w-5" />
				</button>
			</div>

			<div className="space-y-1">
				{folders.length === 0 && !showCreateForm ? (
					<div className="text-sm text-gray-500 ">
						No folders yet. Create your first one!
					</div>
				) : (
					folders.map((folder: Folder) => (
						<FolderListItem
							key={folder.id}
							folder={folder}
							onDelete={handleDeleteFolder}
							isDeleting={isDeleting}
						/>
					))
				)}
				{showCreateForm && (
					<CreateFolderForm
						onSubmit={handleCreateFolder}
						isCreating={isCreating}
						onCancel={() => setShowCreateForm(false)}
					/>
				)}
			</div>
		</div>
	);
}
