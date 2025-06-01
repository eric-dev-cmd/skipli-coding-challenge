import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "@/services/userService";
import { useMemo } from "react";

export const useFavoriteManager = (phoneNumber: string) => {
  const queryClient = useQueryClient();

  // Fetch favorite IDs
  const { data: favoriteUsers = [], refetch } = useQuery({
    queryKey: ["favorite-ids", phoneNumber],
    queryFn: () => userService.getFavoriteIdsByPhone(phoneNumber),
    enabled: !!phoneNumber,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Derived favoriteIds array
  const favoriteIds = useMemo(
    () => favoriteUsers.map((user) => user.id),
    [favoriteUsers]
  );

  // Toggle like/unlike
  const mutation = useMutation({
    mutationFn: async (userId: number) => {
      const action = await userService.likeGithubUser(phoneNumber, userId);
      return { userId, action };
    },
    onSuccess: ({ userId, action }) => {
      queryClient.setQueryData<number[]>(
        ["favorite-ids", phoneNumber],
        (old = []) => {
          if (action === "liked") {
            if (!old.includes(userId)) {
              return [...old, userId];
            }
          } else {
            return old.filter((id) => id !== userId);
          }
          return old;
        }
      );
    },
  });

  return {
    favoriteIds,
    favoriteUsers,
    refetchFavorites: refetch,
    toggleFavorite: mutation.mutateAsync,
  };
};
