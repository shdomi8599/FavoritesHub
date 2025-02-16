import {
  guestFavoriteDelete,
  guestFavoriteHandleStar,
  guestFavoriteVisited,
  guestUpFavoriteVisited,
} from "@/guest/favorite";
import { guestFavoritesState } from "@/states";
import { Favorite } from "@/types";
import { getLocalStorageItem } from "@/util";
import { useSetRecoilState } from "recoil";

export const useGuestFavoriteEvent = () => {
  const setGuestFavorites = useSetRecoilState(guestFavoritesState);

  const favoriteDeleteGuest = async (id: number) => {
    await guestFavoriteDelete(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const favoriteVisitedCountGuest = async (id: number) => {
    await guestUpFavoriteVisited(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const favoriteVisitedGuest = async (id: number) => {
    await guestFavoriteVisited(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const favoriteHandleStarGuest = async (id: number) => {
    await guestFavoriteHandleStar(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  return {
    favoriteDeleteGuest,
    favoriteVisitedCountGuest,
    favoriteVisitedGuest,
    favoriteHandleStarGuest,
  };
};
