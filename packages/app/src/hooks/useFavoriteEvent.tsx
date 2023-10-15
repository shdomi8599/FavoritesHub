import {
  deleteFavorite,
  getFavoriteHandleStar,
  getFavoriteVisited,
  upVisitedCountFavorite,
} from "@/api/favorite";
import { confirmAlert } from "@/util";
import { SetterOrUpdater } from "recoil";

type Props = {
  id: number;
  accessToken: string;
  setIsLoading: SetterOrUpdater<boolean>;
  resetFavoriteList: (presetId: number) => void;
};

export const useFavoriteEvent = ({
  id,
  accessToken,
  setIsLoading,
  resetFavoriteList,
}: Props) => {
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
