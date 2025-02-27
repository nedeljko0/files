import { useState, useEffect, useRef } from "react";
import { FolderIcon } from "./icons/Folder";

interface Props {
	onSubmit: (folderName: string) => Promise<boolean>;
	isCreating: boolean;
	initialValue?: string;
	onCancel?: () => void;
}

export default function CreateFolderForm({
	onSubmit,
	isCreating,
	initialValue = "",
	onCancel,
}: Props) {
	const [folderName, setFolderName] = useState(initialValue);
	const [createdFolder, setCreatedFolder] = useState(false);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, []);

	useEffect(() => {
		if (!folderName.trim()) return;

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(async () => {
			if (!createdFolder) {
				const success = await onSubmit(folderName);
				if (success) {
					setCreatedFolder(true);
				}
			} else {
				await onSubmit(folderName);
			}
		}, 1500);

		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [folderName, onSubmit, createdFolder]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape" && onCancel) {
			e.preventDefault();
			onCancel();
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
			onSubmit(folderName);
		}
	};

	return (
		<div className="mb-1 mt-auto">
			<div className="flex items-center p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
				<div className="flex items-center flex-1">
					<FolderIcon className="h-5 w-5 text-gray-400 mr-2" />
					<input
						type="text"
						value={folderName}
						onChange={(e) => setFolderName(e.target.value)}
						placeholder="New folder name..."
						className="flex-1 bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-gray-700 text-sm"
						autoFocus
						ref={inputRef}
						onKeyDown={handleKeyDown}
						onBlur={() => {
							if (folderName.trim()) {
								onSubmit(folderName);
							} else if (onCancel) {
								onCancel();
							}
						}}
					/>
				</div>
				{isCreating && (
					<span className="text-xs text-gray-500 ml-2">Saving...</span>
				)}
			</div>
		</div>
	);
}
