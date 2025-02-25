import { Link } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Folder } from "@files/shared";
import { createFolder, getFolders } from "../services/folderService";

export default function FolderList() {
	const [newFolderName, setNewFolderName] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const {
		data: folders = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["folders"],
		queryFn: getFolders,
	});

	const handleCreateFolder = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newFolderName.trim()) return;

		try {
			setIsCreating(true);
			await createFolder(newFolderName);
			setNewFolderName("");
			refetch(); // Refresh the folders list
		} catch (err) {
			console.error("Failed to create folder:", err);
		} finally {
			setIsCreating(false);
		}
	};

	if (isLoading) {
		return <div className="p-4">Loading folders...</div>;
	}

	if (isError) {
		return (
			<div className="p-4 text-red-500">
				Error loading folders: {error.message}
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Folders</h2>

			{folders.length === 0 ? (
				<p className="text-gray-500 mb-4">
					No folders yet. Create your first one!
				</p>
			) : (
				<ul>
					{folders.map((folder: Folder) => (
						<li key={folder.id} className="mb-2">
							<Link
								href={`/folder/${folder.id}`}
								className="text-blue-500 hover:underline"
							>
								{folder.name}
							</Link>
						</li>
					))}
				</ul>
			)}

			{isCreating ? (
				<form onSubmit={handleCreateFolder} className="mt-4">
					<input
						type="text"
						value={newFolderName}
						onChange={(e) => setNewFolderName(e.target.value)}
						placeholder="Folder name"
						className="border p-2 rounded mr-2"
						required
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded"
						disabled={isCreating}
					>
						{isCreating ? "Creating..." : "Save"}
					</button>
					<button
						type="button"
						className="ml-2 text-gray-500"
						onClick={() => setIsCreating(false)}
					>
						Cancel
					</button>
				</form>
			) : (
				<button
					onClick={() => setIsCreating(true)}
					className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
				>
					New Folder
				</button>
			)}
		</div>
	);
}
