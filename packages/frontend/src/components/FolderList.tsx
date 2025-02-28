import { useState } from "react";
import { FolderListItem } from "./FolderListItem";
import CreateFolderForm from "./CreateFolderForm";
import { PlusIcon } from "./icons";
import {
	useFoldersQuery,
	useCreateFolderMutation,
	useDeleteFolderMutation,
	useUpdateFolderPositionMutation,
} from "../services/folderQueries";
import { Folder } from "@files/shared/validators/folders";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";

export function FolderList() {
	const [isCreating, setIsCreating] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const navigate = useNavigate();

	const { data: folders = [], isLoading, isError, error } = useFoldersQuery();

	// Sort folders by position
	const sortedFolders = [...folders].sort((a, b) => a.position - b.position);

	const { mutate: deleteFolderMutate, isPending: isDeleting } =
		useDeleteFolderMutation();

	const { mutate: createFolderMutate } = useCreateFolderMutation(() => {
		setShowCreateForm(false);
	});

	const { mutate: updateFolderPosition } = useUpdateFolderPositionMutation();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleCreateFolder = async (folderName: string) => {
		if (!folderName.trim()) return false;

		try {
			setIsCreating(true);
			// Calculate next position from sorted folders, excluding temporary ones
			const actualFolders = folders.filter(
				(f: Folder) => !f.id.startsWith("temp-")
			);
			const maxPosition = Math.max(
				...actualFolders.map((f: Folder) => f.position ?? -1),
				-1
			);
			const nextPosition = maxPosition + 1;

			createFolderMutate({ name: folderName, position: nextPosition });
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
		try {
			await deleteFolderMutate(folderId);
			navigate("/");
		} catch (error) {
			console.error("Error deleting folder:", error);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = sortedFolders.findIndex(
			(folder: Folder) => folder.id === active.id
		);
		const newIndex = sortedFolders.findIndex(
			(folder: Folder) => folder.id === over.id
		);

		if (oldIndex === -1 || newIndex === -1) return;

		// Calculate the actual target position based on drag direction
		const targetPosition = newIndex;

		updateFolderPosition({
			id: active.id as string,
			position: targetPosition,
		});
	};

		if (isLoading) return <div className="p-4 bg-gray-50 h-full min-h-screen animate-pulse" />;

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
					<div className="text-sm text-gray-500">
						No folders yet. Create your first one!
					</div>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={sortedFolders.map((f: Folder) => f.id)}
							strategy={verticalListSortingStrategy}
						>
							{sortedFolders.map((folder: Folder) => (
								<FolderListItem
									key={folder.id}
									folder={folder}
									onDelete={handleDeleteFolder}
									isDeleting={isDeleting}
								/>
							))}
						</SortableContext>
					</DndContext>
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
