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
export function useFoldersQuery() {
	return useQuery({
		queryKey: ["folders"],
		queryFn: getFolders,
		retry: 1,
	});
}

export function useCreateFolderMutation(
	onSuccess?: (newFolder: Folder) => void
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createFolder,
		onSuccess: (newFolder) => {
			queryClient.setQueryData<Folder[]>(["folders"], (old = []) => [
				...old,
				newFolder,
			]);

			if (onSuccess) {
				onSuccess(newFolder);
			}
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
