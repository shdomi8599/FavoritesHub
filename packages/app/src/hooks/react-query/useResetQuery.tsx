import { userIdState } from "@/states";
import { useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

export const useResetQuery = () => {
  const userId = useRecoilValue(userIdState);
  const queryClient = useQueryClient();

  const resetFavoriteList = (presetId: number) => {
    queryClient.invalidateQueries(["favoriteList", userId, presetId]);
  };

  const resetPresetList = async () => {
    await queryClient.invalidateQueries(["presetList", userId]);
  };

  return { resetPresetList, resetFavoriteList };
};
