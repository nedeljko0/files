import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { z } from "zod";

const versionUploadSchema = z.object({
	file: z.instanceof(File, { message: "File is required" }).nullable(),
});

type VersionUploadForm = z.infer<typeof versionUploadSchema>;

interface Props {
	onSubmit: (file: File) => void;
	onCancel: () => void;
	isUploading: boolean;
}

export function VersionUploadForm({ onSubmit, onCancel, isUploading }: Props) {
	const {
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		setError,
		clearErrors,
	} = useForm<VersionUploadForm>({
		resolver: zodResolver(versionUploadSchema),
	});

	const file = watch("file");
	const isSubmitDisabled = !file || isUploading;

	const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (!allowedTypes.includes(file.type)) {
				setValue("file", null);
				setError("file", {
					type: "manual",
					message: `Invalid file type. Allowed types: JPG, PNG, PDF`,
				});
			} else {
				setValue("file", file);
				clearErrors("file");
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit((data) => {
				if (data.file) onSubmit(data.file);
			})}
			className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
		>
			<div className="mb-4">
				<label
					htmlFor="file"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					File *
				</label>
				<div className="space-y-1">
					<input
						type="file"
						id="file"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						onChange={handleFileChange}
						accept={allowedTypes.join(",")}
					/>
					<p className="text-sm text-gray-500">
						Allowed file types: JPG, PNG, PDF
					</p>
					{errors.file && (
						<p className="text-sm text-red-500 mt-1">{errors.file.message}</p>
					)}
				</div>
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
					disabled={isSubmitDisabled}
					isLoading={isUploading}
					className="p-2 bg-primary rounded-md text-white hover:bg-primary/90 disabled:bg-primary-disabled"
				>
					Upload
				</Button>
			</div>
		</form>
	);
}
