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
	} = useForm<CreateDocumentForm>({
		resolver: zodResolver(createDocumentFormSchema),
		defaultValues: {
			folderId,
			title: "",
			description: "",
		},
	});

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
					<input
						type="file"
						id="file"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						onChange={(e) => {
							if (e.target.files?.[0]) {
								setValue("file", e.target.files[0]);
							}
						}}
					/>
					{errors.file && (
						<p className="text-sm text-red-500 mt-1">{errors.file.message}</p>
					)}
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
						disabled={isPending}
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
