import { Button } from "@heroui/button";
import { DocumentIcon, TrashIcon } from "../icons";
import { Document } from "@files/shared/validators/documents";

interface Props {
	document: Document;
	onEdit: () => void;
	onDelete: () => void;
	isDeleting: boolean;
}

export function DocumentHeader({
	document,
	onEdit,
	onDelete,
	isDeleting,
}: Props) {
	return (
		<div className="flex items-start justify-between mb-6">
			<div className="flex items-center">
				<DocumentIcon className="h-8 w-8 text-primary mr-3" />
				<div>
					<h1 className="text-2xl font-semibold text-gray-800">
						{document.title}
					</h1>
					{document.description && (
						<p className="mt-2 text-gray-600">{document.description}</p>
					)}
				</div>
			</div>

			<div className="flex space-x-2">
				<Button
					onPress={onEdit}
					variant="ghost"
					size="sm"
					title="Edit document"
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
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
				</Button>

				<Button
					onPress={onDelete}
					variant="ghost"
					size="sm"
					title="Delete document"
					disabled={isDeleting}
					className="text-gray-500 hover:text-red-500"
				>
					<TrashIcon className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
