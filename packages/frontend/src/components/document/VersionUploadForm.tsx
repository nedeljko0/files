import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { z } from "zod";

const versionUploadSchema = z.object({
	file: z.instanceof(File, { message: "File is required" }),
});

type VersionUploadForm = z.infer<typeof versionUploadSchema>;

interface Props {
	onSubmit: (file: File) => void;
	onCancel: () => void;
	isUploading: boolean;
}

export function VersionUploadForm({ onSubmit, onCancel, isUploading }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<VersionUploadForm>({
		resolver: zodResolver(versionUploadSchema),
	});

	const hasFile = !!watch("file");

	return (
		<form
			onSubmit={handleSubmit((data) => onSubmit(data.file))}
			className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
		>
			<div className="mb-4">
				<label
					htmlFor="file"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					File *
				</label>
				<input
					type="file"
					id="file"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					onChange={(e) => {
						if (e.target.files?.[0]) {
							register("file").onChange(e);
						}
					}}
				/>
				{errors.file && (
					<p className="text-sm text-red-500 mt-1">{errors.file.message}</p>
				)}
			</div>

			<div className="flex justify-end gap-2">
				<Button
					type="button"
					onPress={onCancel}
					disabled={isUploading}
					className="p-2 rounded-md border"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isUploading || !hasFile}
					isLoading={isUploading}
					className="p-2 rounded-md text-white hover:bg-primary/90 disabled:bg-primary-disabled"
				>
					Upload
				</Button>
			</div>
		</form>
	);
}
