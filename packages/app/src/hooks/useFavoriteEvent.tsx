import {
  deleteFavorite,
  getFavoriteHandleStar,
  getFavoriteVisited,
  upVisitedCountFavorite,
} from "@/api/favorite";
import {
  accessTokenState,
  isLoadingState,
  userIdState,
  viewPresetState,
} from "@/states";
import { confirmAlert } from "@/util";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useResetQuery } from "./react-query";

export const useFavoriteEvent = () => {
  const userId = useRecoilValue(userIdState);
  const accessToken = useRecoilValue(accessTokenState);
  const viewPreset = useRecoilValue(viewPresetState);
  const { id } = viewPreset;

  const setIsLoading = useSetRecoilState(isLoadingState);
  const { resetFavoriteList } = useResetQuery(userId);

  const deleteFavoriteEvent = async (favoriteId: number) => {
    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "즐겨찾기 삭제가");
      await deleteFavorite(favoriteId, accessToken);
      resetFavoriteList(id);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const favoriteVisited = async (favoriteId: number) => {
    try {
      await getFavoriteVisited(favoriteId, accessToken);
      resetFavoriteList(id);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    }
  };

  const favoriteHandleStar = async (favoriteId: number) => {
    try {
      await getFavoriteHandleStar(favoriteId, accessToken);
      resetFavoriteList(id);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    }
  };

  const upFavoriteVisitedCount = async (id: number) => {
    try {
      await upVisitedCountFavorite(id, accessToken);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    }
  };

  return {
    deleteFavoriteEvent,
    favoriteVisited,
    favoriteHandleStar,
    upFavoriteVisitedCount,
  };
};
