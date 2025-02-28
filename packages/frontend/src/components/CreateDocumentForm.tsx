import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateDocumentMutation } from "../services/documentQueries";
import { Button } from "@heroui/button";
import {
	type CreateDocumentForm,
	createDocumentFormSchema,
} from "@files/shared/validators/documents";

interface Props {
	folderId: string;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function CreateDocumentForm({
	folderId,
	onCancel,
	onSuccess,
}: Props) {
	const { mutate: createDocument, isPending } =
		useCreateDocumentMutation(onSuccess);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		setError,
		clearErrors,
	} = useForm<CreateDocumentForm>({
		resolver: zodResolver(createDocumentFormSchema),
		defaultValues: {
			folderId,
			title: "",
			description: "",
		},
	});

	const title = watch("title");
	const file = watch("file");
	const isSubmitDisabled = !title || !file || isPending;

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

	const onSubmit = (data: CreateDocumentForm) => {
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("folderId", data.folderId);

		if (data.description?.trim()) {
			formData.append("description", data.description);
		}

		formData.append("file", data.file);
		createDocument(formData);
	};

	return (
		<div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
			<h3 className="text-lg font-medium text-gray-800 mb-4">
				Create New Document
			</h3>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="mb-4">
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Title *
					</label>
					<input
						type="text"
						id="title"
						className={`w-full px-3 py-2 border ${
							errors.title ? "border-red-500" : "border-gray-300"
						} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
						{...register("title")}
					/>
					{errors.title && (
						<p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
					)}
				</div>

				<div className="mb-4">
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Description
					</label>
					<textarea
						id="description"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows={3}
						{...register("description")}
					/>
				</div>

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
							<p className="text-sm text-red-500">
								{errors.file.message?.toString()}
							</p>
						)}
					</div>
				</div>

				<div className="flex justify-end gap-2">
					<Button
						onPress={onCancel}
						disabled={isPending}
						className="p-2 rounded-md border"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						color="primary"
						disabled={isSubmitDisabled}
						isLoading={isPending}
						className="p-2 rounded-md text-white hover:bg-primary/90 disabled:bg-primary-disabled"
					>
						Create Document
					</Button>
				</div>
			</form>
		</div>
	);
}
