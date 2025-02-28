import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { UpdateDocumentForm, updateDocumentSchema } from "@files/shared/validators/documents";


interface Props {
	documentId: string;
	initialTitle: string;
	initialDescription: string;
	onSubmit: (data: UpdateDocumentForm) => void;
	onCancel: () => void;
	isUpdating: boolean;
}

export function DocumentEditForm({
	initialTitle,
	initialDescription,
	onSubmit,
	onCancel,
	isUpdating,
}: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateDocumentForm>({
		resolver: zodResolver(updateDocumentSchema),
		defaultValues: {
			title: initialTitle,
			description: initialDescription,
		},
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="w-full">
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

			<div className="flex justify-end gap-2">
				<Button
					
					onPress={onCancel}
					disabled={isUpdating}
					className="p-2 rounded-md border"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isUpdating}
					isLoading={isUpdating}
					className="p-2 bg-primary rounded-md text-white hover:bg-primary/90 disabled:bg-primary-disabled"
				>
					Save Changes
				</Button>
			</div>
		</form>
	);
}
