import { Folder } from "@files/shared/validators/folders";
import { FolderIcon, TrashIcon } from "./icons";
import { useState, useRef } from "react";
import CreateFolderForm from "./CreateFolderForm";
import { useUpdateFolderMutation } from "../services/folderQueries";

interface Props {
	folder: Folder;
	onDelete: (id: string) => void;
	isDeleting: boolean;
}

export function FolderListItem({ folder, onDelete, isDeleting }: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const { mutate: updateFolderMutate, isPending: isUpdating } =
		useUpdateFolderMutation();
	const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [clickCount, setClickCount] = useState(0);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// Increment click count
		const newClickCount = clickCount + 1;
		setClickCount(newClickCount);

		if (clickTimeoutRef.current) {
			clearTimeout(clickTimeoutRef.current);
		}

		clickTimeoutRef.current = setTimeout(() => {
			if (newClickCount === 1) {
				window.location.href = `/folder/${folder.id}`;
			} else if (newClickCount === 2) {
				setIsEditing(true);
			}
			setClickCount(0);
		}, 250); // 250ms delay to detect double clicks
	};

	const handleUpdateFolder = async (folderName: string) => {
		if (!folderName.trim() || folderName === folder.name) {
			setIsEditing(false);
			return false;
		}

		try {
			await updateFolderMutate({ id: folder.id, name: folderName });
			setIsEditing(false);
			return true;
		} catch (err) {
			console.error("Failed to update folder:", err);
			return false;
		}
	};

	if (isEditing) {
		return (
			<CreateFolderForm
				onSubmit={handleUpdateFolder}
				isCreating={isUpdating}
				initialValue={folder.name}
				onCancel={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-200 transition-colors group relative">
			<div
				className="flex items-center flex-1 cursor-pointer"
				onClick={handleClick}
			>
				<FolderIcon className="h-5 w-5 text-gray-400 mr-2 group-hover:text-gray-600" />
				<span className="text-gray-700 group-hover:text-gray-900">
					{folder.name}
				</span>
			</div>
			<button
				onClick={() => onDelete(folder.id)}
			
				className="hidden group-hover:block text-secondary hover:text-red-500"
				disabled={isDeleting}
			>
				<TrashIcon className="h-5 w-5" />
			</button>
		</div>
	);
}
