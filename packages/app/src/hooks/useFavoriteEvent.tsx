import {
  deleteFavorite,
  getFavoriteHandleStar,
  getFavoriteVisited,
  postFavoriteRelocation,
  upVisitedCountFavorite,
} from "@/api/favorite";
import {
  accessTokenState,
  dragFavoriteDataState,
  favoriteOrderListState,
  isDisableLayoutUpdateState,
  isLoadingState,
  viewPresetState,
} from "@/states";
import { confirmAlert } from "@/util";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useResetQuery } from "./react-query";

export const useFavoriteEvent = () => {
  const { resetFavoriteList } = useResetQuery();
  const viewPreset = useRecoilValue(viewPresetState);
  const accessToken = useRecoilValue(accessTokenState);
  const dragFavoriteData = useRecoilValue(dragFavoriteDataState);
  const favoriteOrderList = useRecoilValue(favoriteOrderListState);
  const id = viewPreset?.id;

  const setIsLoading = useSetRecoilState(isLoadingState);
  const setIsDisableLayoutUpdate = useSetRecoilState(
    isDisableLayoutUpdateState,
  );

  const favoriteDelete = async (favoriteId: number) => {
    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "즐겨찾기 삭제가");
      await favoriteRelocation();
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
      setIsDisableLayoutUpdate(true);
      await favoriteRelocation();
      await getFavoriteVisited(favoriteId, accessToken);
      resetFavoriteList(id);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setTimeout(() => {
        setIsDisableLayoutUpdate(false);
      }, 500);
    }
  };

  const favoriteHandleStar = async (favoriteId: number) => {
    try {
      setIsDisableLayoutUpdate(true);
      await favoriteRelocation();
      await getFavoriteHandleStar(favoriteId, accessToken);
      resetFavoriteList(id);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setTimeout(() => {
        setIsDisableLayoutUpdate(false);
      }, 500);
    }
  };

  const favoriteVisitedCount = async (id: number) => {
    try {
      setIsDisableLayoutUpdate(true);
      await favoriteRelocation();
      await upVisitedCountFavorite(id, accessToken);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setTimeout(() => {
        setIsDisableLayoutUpdate(false);
      }, 500);
    }
  };

  const favoriteRelocation = async () => {
    const currentPresetId = viewPreset.id;

    const orderList = favoriteOrderList.map(({ id, order }) => ({ id, order }));
    const sortedDragFavoriteData = dragFavoriteData
      .slice()
      .sort((a, b) => a.order - b.order);

    const isSameOrder = sortedDragFavoriteData.every(
      ({ id, order }, index) =>
        id === orderList[index]?.id && order === orderList[index]?.order,
    );

    if (isSameOrder) return;

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
    favoriteDelete,
    favoriteVisited,
    favoriteHandleStar,
    favoriteVisitedCount,
    favoriteRelocation,
  };
};
