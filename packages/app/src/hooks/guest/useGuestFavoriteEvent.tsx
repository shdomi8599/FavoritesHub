import {
  guestFavoriteAdd,
  guestFavoriteDelete,
  guestFavoriteEdit,
  guestFavoriteHandleStar,
  guestFavoriteRelocation,
  guestFavoriteVisited,
  guestUpFavoriteVisited,
} from "@/guest/favorite";
import {
  favoriteOrderListState,
  guestFavoritesState,
  isDisableLayoutUpdateState,
  selectedFavoriteIdState,
} from "@/states";
import { Favorite } from "@/types";
import { errorAlert, getLocalStorageItem, successAlert } from "@/util";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useFavoriteModal } from "../useFavoriteModal";

export const useGuestFavoriteEvent = () => {
  const { offFavoriteModal } = useFavoriteModal();

  const selectedFavoriteId = useRecoilValue(selectedFavoriteIdState);
  const favoriteOrderList = useRecoilValue(favoriteOrderListState);
  const setGuestFavorites = useSetRecoilState(guestFavoritesState);
  const setIsDisableLayoutUpdate = useSetRecoilState(
    isDisableLayoutUpdateState,
  );

  const favoriteAddGuest = async (favoriteName: string, address: string) => {
    try {
      await favoriteRelocationGuest();
      await guestFavoriteAdd(favoriteName, address);

      const favorites: Favorite[] = getLocalStorageItem("favoriteList");
      setGuestFavorites([...favorites]);
      offFavoriteModal();

      successAlert("즐겨찾기가 추가되었습니다.", "즐겨찾기 추가");
    } catch (e) {
      return errorAlert("이미 존재하는 주소입니다.", "즐겨찾기 추가");
    }
  };

  const favoriteEditGuest = async (favoriteName: string) => {
    setIsDisableLayoutUpdate(true);
    try {
      await favoriteRelocationGuest();
      await guestFavoriteEdit(favoriteName, selectedFavoriteId);

      const favorites: Favorite[] = getLocalStorageItem("favoriteList");
      setGuestFavorites([...favorites]);

      offFavoriteModal();
      successAlert("즐겨찾기가 수정되었습니다.", "즐겨찾기 수정");
    } catch (e) {
    } finally {
      setTimeout(() => {
        setIsDisableLayoutUpdate(false);
      }, 500);
    }
  };

  const favoriteDeleteGuest = async (id: number) => {
    await favoriteRelocationGuest();
    await guestFavoriteDelete(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const favoriteVisitedCountGuest = async (id: number) => {
    setIsDisableLayoutUpdate(true);

    await guestUpFavoriteVisited(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);

    setTimeout(() => {
      setIsDisableLayoutUpdate(false);
    }, 500);
  };

  const favoriteVisitedGuest = async (id: number) => {
    setIsDisableLayoutUpdate(true);

    await guestFavoriteVisited(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);

    setTimeout(() => {
      setIsDisableLayoutUpdate(false);
    }, 500);
  };

  const favoriteHandleStarGuest = async (id: number) => {
    setIsDisableLayoutUpdate(true);

    await guestFavoriteHandleStar(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);

    setTimeout(() => {
      setIsDisableLayoutUpdate(false);
    }, 500);
  };

  const favoriteRelocationGuest = async () => {
    await guestFavoriteRelocation(favoriteOrderList);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    if (favorites) {
      setGuestFavorites([...favorites]);
    }
  };

  return {
    favoriteAddGuest,
    favoriteEditGuest,
    favoriteDeleteGuest,
    favoriteVisitedCountGuest,
    favoriteVisitedGuest,
    favoriteHandleStarGuest,
    favoriteRelocationGuest,
  };
};
