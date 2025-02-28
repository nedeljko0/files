import { useState } from "react";
import {
	useDocumentsByFolderQuery,
	useDeleteDocumentMutation,
} from "../services/documentQueries";
import { PlusIcon } from "./icons";
import { DocumentListItem } from "./DocumentListItem";
import CreateDocumentForm from "./CreateDocumentForm";
import { Button } from "@heroui/button";
import { Document } from "@files/shared/validators/documents";
import {
	DndContext,
	useSensor,
	useSensors,
	PointerSensor,
	DragEndEvent,
	DragStartEvent,
	DragOverlay,
	MeasuringStrategy,
	rectIntersection,
} from "@dnd-kit/core";
import { DroppableTrash } from "./DroppableTrash";

interface Props {
	folderId: string;
	folderName: string;
}

export function DocumentList({ folderId, folderName }: Props) {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

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

	const { mutate: deleteDocument } = useDeleteDocumentMutation(folderId);

	const handleDragStart = (event: DragStartEvent) =>
		setActiveId(event.active.id as string);

	const handleDragEnd = (event: DragEndEvent) => {
		setActiveId(null);

		const { active, over } = event;

		if (over?.id === "trash") {
			deleteDocument(active.id as string);
		}
	};

	const handleDragCancel = () => {
		setActiveId(null);
	};

	if (isLoading) return <div className="p-4 bg-white animate-pulse" />;
	if (isError)
		return <div className="p-4 text-red-500">Error: {error.message}</div>;

	return (
		<div className="p-4">
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}
				measuring={{
					droppable: {
						strategy: MeasuringStrategy.Always,
					},
				}}
				collisionDetection={rectIntersection}
			>
				<div className="relative">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-medium text-gray-800">
							{folderName} - Documents
						</h2>
						{documents.length !== 0 && (
							<Button
								color="primary"
								onPress={() => setShowCreateForm(true)}
								className="p-2 rounded-md text-white hover:bg-primary/90 disabled:bg-primary-disabled"
							>
								<PlusIcon className="h-4 w-4" />
								<span>New Document</span>
							</Button>
						)}
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
						<div className="relative">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
								{documents.map((document) => (
									<DocumentListItem key={document.id} document={document} />
								))}
							</div>

							<DroppableTrash
								isVisible={activeId !== null}
								onDrop={(id) => deleteDocument(id)}
							/>

							<DragOverlay>
								{activeId ? (
									<DocumentListItem
										document={documents.find((doc) => doc.id === activeId)!}
									/>
								) : null}
							</DragOverlay>
						</div>
					)}
				</div>
			</DndContext>
		</div>
	);
}
