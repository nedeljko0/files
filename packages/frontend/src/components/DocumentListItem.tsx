import { Document } from "@files/shared/validators/documents";
import { formatDistanceToNow } from "date-fns";
import { getLatestFileDownloadUrl } from "../services/document";
import { DocumentIcon, DownloadIcon } from "./icons";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface Props {
	document: Document;
}

export function DocumentListItem({ document }: Props) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: document.id,
			data: {
				type: "document",
				document,
			},
		});

	const style = React.useMemo(
		() => ({
			transform: CSS.Transform.toString(transform),
			opacity: isDragging ? 0.5 : 1,
			touchAction: "none",
		}),
		[transform, isDragging]
	);

	const latestVersion = document.versions[0];
	const hasVersions = document.versions.length > 0;

	const handleClick = (e: React.MouseEvent) => {
		if (!isDragging) {
			window.location.href = `/document/${document.id}`;
		}
		e.preventDefault();
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-all cursor-move
				${isDragging ? "z-50" : ""}`}
			onClick={handleClick}
		>
			<div className="flex items-start justify-between">
				<div className="flex items-center">
					<DocumentIcon className="h-6 w-6 text-primary mr-2" />
					<h3 className="font-medium text-gray-800 truncate">
						{document.title}
					</h3>
				</div>

				{hasVersions && (
					<a
						href={getLatestFileDownloadUrl(document.id)}
						className="text-gray-500 hover:text-blue-500 transition-colors"
						onClick={(e) => e.stopPropagation()}
					>
						<DownloadIcon className="h-5 w-5 text-primary hover:text-primary/80" />
					</a>
				)}
			</div>

			{document.description && (
				<p className="mt-2 text-sm text-gray-600 line-clamp-2">
					{document.description}
				</p>
			)}

			<div className="mt-3 flex items-center justify-between text-xs text-gray-500">
				<span>
					{hasVersions
						? `${document.versions.length} version${
								document.versions.length !== 1 ? "s" : ""
						  }`
						: "No versions"}
				</span>

				{hasVersions && (
					<span>
						Updated{" "}
						{formatDistanceToNow(new Date(latestVersion.uploadedAt), {
							addSuffix: true,
						})}
					</span>
				)}
			</div>
		</div>
	);
}
