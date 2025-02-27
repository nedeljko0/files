import { Document } from "@files/shared/validators/documents";
import { formatDistanceToNow } from "date-fns";
import { getLatestFileDownloadUrl } from "../services/document";
import { DocumentIcon, DownloadIcon } from "./icons";

interface Props {
	document: Document;
}

export function DocumentListItem({ document }: Props) {
	const latestVersion = document.versions[0];
	const hasVersions = document.versions.length > 0;

	const handleClick = () => {
		window.location.href = `/document/${document.id}`;
	};

	return (
		<div
			className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
			onClick={handleClick}
		>
			<div className="p-4">
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
		</div>
	);
}
