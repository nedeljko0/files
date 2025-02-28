import { useDroppable } from "@dnd-kit/core";
import { TrashIcon } from "./icons";
import { useEffect } from "react";

interface Props {
	isVisible: boolean;
	onDrop: (id: string) => void;
}

export function DroppableTrash({ isVisible, onDrop }: Props) {
	const { setNodeRef, isOver, active } = useDroppable({
		id: "trash",
		data: { onDrop },
	});

	useEffect(() => {
		if (isOver && active) {
			onDrop(active.id as string);
		}
	}, [isOver, active, onDrop]);

	return (
		<div
			ref={setNodeRef}
			className={`
        fixed bottom-0 left-1/2 transform -translate-x-1/2
        bg-red-500 text-white p-6  shadow-lg
        flex items-center justify-center 
        transition-all duration-200 ease-in-out
        w-full h-[200px]
        ${isOver ? "bg-red-600 scale-110" : ""}
        ${
					isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-full pointer-events-none"
				}
      `}
			style={{
				zIndex: 999,
			}}
		>
			<TrashIcon className="h-6 w-6" />
			<span>Drop to delete</span>
		</div>
	);
}
