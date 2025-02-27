import { format, formatDistanceToNow } from "date-fns";
import { DownloadIcon } from "../icons";
import { getFileDownloadUrl } from "../../services/document";
import formatFileSize from "../../utils/file";

interface FileVersion {
	id: string;
	name: string;
	path: string;
	size: number;
	uploadedAt: Date;
	documentId: string;
}

interface Props {
	versions: FileVersion[];
}

export function DocumentVersions({ versions }: Props) {
	if (versions.length === 0) {
		return (
			<div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
				<p className="text-gray-500">No file versions available.</p>
			</div>
		);
	}

	return (
		<div className="border border-gray-200 rounded-lg overflow-hidden">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Version
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Filename
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Size
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Uploaded
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{versions.map((version, index) => (
						<tr key={version.id} className={index === 0 ? "bg-blue-50" : ""}>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{index === 0 ? (
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
										Latest
									</span>
								) : (
									`v${versions.length - index}`
								)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
								{version.name}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{formatFileSize(version.size)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{format(version.uploadedAt, "MMM d, yyyy 'at' h:mm a")}
								<div className="text-xs text-gray-400">
									{formatDistanceToNow(version.uploadedAt, {
										addSuffix: true,
									})}
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<a
									href={getFileDownloadUrl(version.id)}
									className="text-blue-600 hover:text-blue-900"
									title="Download"
								>
									<DownloadIcon className="inline h-5 w-5 text-primary hover:text-primary/80" />
								</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
