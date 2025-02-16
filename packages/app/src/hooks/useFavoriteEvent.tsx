import {
  deleteFavorite,
  getFavoriteHandleStar,
  getFavoriteVisited,
  postFavoriteRelocation,
  upVisitedCountFavorite,
} from "@/api/favorite";
import {
  accessTokenState,
  favoriteOrderListState,
  isLoadingState,
  viewPresetState,
} from "@/states";
import { confirmAlert } from "@/util";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useResetQuery } from "./react-query";

export const useFavoriteEvent = () => {
  const viewPreset = useRecoilValue(viewPresetState);
  const accessToken = useRecoilValue(accessTokenState);
  const favoriteOrderList = useRecoilValue(favoriteOrderListState);
  const id = viewPreset?.id;

  const setIsLoading = useSetRecoilState(isLoadingState);
  const { resetFavoriteList } = useResetQuery();

  const deleteFavoriteEvent = async (favoriteId: number) => {
    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "즐겨찾기 삭제가");
      await deleteFavorite(id, favoriteId, accessToken);
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

  const relocationFavorites = async () => {
    const currentPresetId = viewPreset.id;
    const orderList = favoriteOrderList.map(({ id, order }) => {
      return { id, order };
    });
    try {
      await postFavoriteRelocation(currentPresetId, orderList, accessToken);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      resetFavoriteList(currentPresetId);
    }
  };

  return {
    deleteFavoriteEvent,
    favoriteVisited,
    favoriteHandleStar,
    upFavoriteVisitedCount,
    relocationFavorites,
  };
};
