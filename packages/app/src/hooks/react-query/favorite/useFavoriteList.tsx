import { getFavoriteList } from "@/api/favorite";
import { Favorite } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useFavoriteList = (
  userId: number,
  presetId: number,
  accessToken: string,
) => {
  const data = useQuery<Favorite[]>(
    ["favoriteList", userId, presetId],
    () => getFavoriteList(presetId, accessToken),
    {
      enabled: !!accessToken && !!presetId,
    },
  );
  return data || [];
};
