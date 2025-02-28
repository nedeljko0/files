import { Folder } from "@files/shared/validators/folders";
import { FolderIcon, TrashIcon } from "./icons";
import { useState, useRef } from "react";
import CreateFolderForm from "./CreateFolderForm";
import { useUpdateFolderMutation } from "../services/folderQueries";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleIcon } from "./icons";

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
	const isDragging = useRef(false);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging: dndIsDragging,
	} = useSortable({ id: folder.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const handleClick = (e: React.MouseEvent) => {
		if (dndIsDragging) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

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
		}, 250);
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
		<div
			ref={setNodeRef}
			style={style}
			className="flex items-center justify-between p-2 rounded-md hover:bg-gray-200 transition-colors group relative"
		>
			<div
				{...attributes}
				{...listeners}
				className="hidden group-hover:block mr-2 cursor-grab"
			>
				<DragHandleIcon className="h-5 w-5 text-primary" />
			</div>
			<div
				className="flex items-center flex-1 cursor-pointer"
				onClick={handleClick}
			>
				<FolderIcon className="h-5 w-5 text-primary mr-2 group-hover:text-black" />
				<span className="text-gray-700 group-hover:text-gray-900">
					{folder.name}
				</span>
			</div>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onDelete(folder.id);
				}}
				className="hidden group-hover:block text-secondary hover:text-red-500"
				disabled={isDeleting}
			>
				<TrashIcon className="h-5 w-5" />
			</button>
		</div>
	);
}
