import { Favorite } from "@/types";
import {
  confirmAlert,
  errorAlert,
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/util";
import moment from "moment";

export const guestFavoriteAdd = async (
  favoriteName: string,
  address: string,
) => {
  const favoriteList: Favorite[] = getLocalStorageItem("favoriteList");
  const currentDate = moment().format("YYYY-MM-DD hh:mm:ss");

  const existFavorite = favoriteList?.find((fav) => fav.address === address);

  if (existFavorite) {
    return errorAlert("이미 존재하는 주소입니다.", "즐겨찾기 추가");
  }

  const isNotFavoriteList = favoriteList?.length === 0 || !favoriteList;
  const id = isNotFavoriteList
    ? 1
    : favoriteList[favoriteList?.length - 1]?.id + 1;

  const favorite: Favorite = {
    id,
    favoriteName,
    address,
    createdAt: currentDate,
    lastVisitedAt: currentDate,
    description: "",
    imgHref: "",
    star: false,
    title: "",
    visitedCount: 0,
  };

  if (isNotFavoriteList) {
    return setLocalStorageItem("favoriteList", [favorite]);
  }

  setLocalStorageItem("favoriteList", [...favoriteList, favorite]);
};

export const guestFavoriteEdit = async (favoriteName: string, id: number) => {
  const favoriteList: Favorite[] = getLocalStorageItem("favoriteList");

  const newFavoriteList = favoriteList.map((fav) => {
    if (fav.id === id) {
      fav.favoriteName = favoriteName;
    }
    return fav;
  });

  setLocalStorageItem("favoriteList", newFavoriteList);
};

export const guestFavoriteDelete = async (id: number) => {
  await confirmAlert("정말 삭제하시겠습니까?", "즐겨찾기 삭제가");

  const favoriteList: Favorite[] = getLocalStorageItem("favoriteList");

  const newFavoriteList = favoriteList.filter((fav) => fav.id !== id);

  setLocalStorageItem("favoriteList", newFavoriteList);
};

export const guestFavoriteVisited = async (id: number) => {
  const currentDate = moment().format("YYYY-MM-DD hh:mm:ss");
  const favoriteList: Favorite[] = getLocalStorageItem("favoriteList");

  const newFavoriteList = favoriteList.map((fav) => {
    if (fav.id === id) {
      fav.lastVisitedAt = currentDate;
    }
    return fav;
  });

  setLocalStorageItem("favoriteList", newFavoriteList);
};

export const guestUpFavoriteVisited = async (id: number) => {
  const favoriteList: Favorite[] = getLocalStorageItem("favoriteList");

  const newFavoriteList = favoriteList.map((fav) => {
    if (fav.id === id) {
      fav.visitedCount++;
    }
    return fav;
  });

  setLocalStorageItem("favoriteList", newFavoriteList);
};

export const guestFavoriteHandleStar = async (id: number) => {
  const favoriteList: Favorite[] = getLocalStorageItem("favoriteList");

  const newFavoriteList = favoriteList.map((fav) => {
    if (fav.id === id) {
      fav.star = !fav.star;
    }
    return fav;
  });

  setLocalStorageItem("favoriteList", newFavoriteList);
};
