import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Folder } from "@files/shared";
import { createFolder, getFolders, deleteFolder, updateFolder } from "./folder";

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
		mutationFn: createFolder,
		onMutate: async (newFolderName) => {
			await queryClient.cancelQueries({ queryKey: ["folders"] });
			const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);

			const optimisticFolder: Folder = {
				id: `temp-${Date.now()}`,
				name: newFolderName,
			};

			queryClient.setQueryData<Folder[]>(["folders"], (old = []) => [
				...old,
				optimisticFolder,
			]);

			return { previousFolders };
		},
		onError: (_err, _, context) => {
			// If the mutation fails, roll back to the previous state
			if (context?.previousFolders) {
				queryClient.setQueryData(["folders"], context.previousFolders);
			}
		},
		onSuccess: (newFolder) => {
			queryClient.setQueryData<Folder[]>(["folders"], (old = []) => {
				// Replace any temporary folder with the real one
				const filtered = old.filter((f) => f.id && !f.id.startsWith("temp-"));
				return [...filtered, newFolder];
			});

			if (onSuccess) {
				onSuccess(newFolder);
			}
		},
		onSettled: () => {
			// Refetch after error or success to ensure cache is in sync
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
		onError: (_err, _, context) => {
			if (context?.previousFolders) {
				queryClient.setQueryData(["folders"], context.previousFolders);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
		},
	});
}

export function useUpdateFolderMutation(
	onError?: (error: Error) => void,
	onSuccess?: (updatedFolder: Folder) => void
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, name }: { id: string; name: string }) =>
			updateFolder(id, name),
		onError,
		onSuccess: (updatedFolder) => {
			queryClient.setQueryData<Folder[]>(["folders"], (old = []) =>
				old.map((folder) =>
					folder.id === updatedFolder.id ? updatedFolder : folder
				)
			);
			onSuccess?.(updatedFolder);
		},
	});
}
