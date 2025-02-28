import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Folder } from "@files/shared";
import { createFolder, getFolders, deleteFolder, updateFolder } from "./folder";
import { showAlert } from "../utils/alerts";

/**
 * Folder query and mutation hooks
 *
 * Note: The delete folder mutation uses optimistic updates and cache manipulation
 * to immediately update the UI when a folder is deleted, before the server responds.
 * This provides a better user experience by avoiding UI flicker or delay after
 * deletion actions. If the server request fails, the previous state is restored.
 */
export function useFoldersQuery(id?: string) {
	return useQuery({
		queryKey: ["folders", id],
		queryFn: () => (id ? getFolders(id) : getFolders()),
		retry: 1,
	});
}

export function useCreateFolderMutation(
	onSuccess?: (newFolder: Folder) => void
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			name,
			position,
		}: {
			name: string;
			position: number;
		}) => {
			return createFolder(name, position);
		},
		onMutate: async (newFolder: { name: string; position: number }) => {
			await queryClient.cancelQueries({ queryKey: ["folders"] });
			const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);

			const optimisticFolder: Folder = {
				id: `temp-${Date.now()}`,
				name: newFolder.name,
				position: newFolder.position,
			};

			queryClient.setQueryData<Folder[]>(["folders"], (old = []) => [
				...old,
				optimisticFolder,
			]);

			return { previousFolders };
		},
		onError: (err, _, context) => {
			if (context?.previousFolders) {
				queryClient.setQueryData(["folders"], context.previousFolders);
			}
			showAlert("Failed to create folder", true);
			console.error("Error creating folder:", err);
		},
		onSuccess: (newFolder) => {
			queryClient.setQueryData<Folder[]>(["folders"], (old = []) => {
				const filtered = old.filter((f) => f.id && !f.id.startsWith("temp-"));
				return [...filtered, newFolder];
			});
			showAlert("Folder created successfully");
			if (onSuccess) {
				onSuccess(newFolder);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
		},
	});
}

export function useDeleteFolderMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteFolder,
		onMutate: async (deletedFolderId) => {
			await queryClient.cancelQueries({ queryKey: ["folders"] });
			const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);

			queryClient.setQueryData<Folder[]>(["folders"], (old = []) =>
				old.filter((folder) => folder.id !== deletedFolderId)
			);

			return { previousFolders };
		},
		onError: (err, _, context) => {
			if (context?.previousFolders) {
				queryClient.setQueryData(["folders"], context.previousFolders);
			}
			showAlert("Failed to delete folder", true);
			console.error("Error deleting folder:", err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
		},
		onSuccess: () => {
			showAlert("Folder deleted successfully");
		},
	});
}

export function useUpdateFolderMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const result = await updateFolder(id, name);
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
			showAlert("Folder updated successfully");
		},
		onError: (error) => {
			showAlert("Failed to update folder", true);
			console.error("Error updating folder:", error);
		},
	});
}

export function useUpdateFolderPositionMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, position }: { id: string; position: number }) => {
			const result = await updateFolder(id, undefined, position);
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
			showAlert("Folder position updated successfully");
		},
		onError: (error) => {
			showAlert("Failed to update folder position", true);
			console.error("Position update failed:", error);
		},
	});
}
