import { useQueryClient } from "@tanstack/react-query";

export const useResetQuery = (userId: number) => {
  const queryClient = useQueryClient();

  const resetFavoriteList = (presetId: number) => {
    queryClient.invalidateQueries(["favoriteList", userId, presetId]);
  };

  const resetPresetList = async () => {
    await queryClient.invalidateQueries(["presetList", userId]);
  };

  return { resetPresetList, resetFavoriteList };
};
