import { Favorite } from "@/types";
import { errorAlert, getLocalStorageItem } from "@/util";
import moment from "moment";

export const localFavoriteAdd = (favoriteName: string, address: string) => {
  const favoriteList: Favorite[] = getLocalStorageItem("favoriteList");

  const existFavorite = favoriteList?.find((fav) => fav.address === address);

  if (existFavorite) {
    return errorAlert("이미 존재하는 주소입니다.", "즐겨찾기 추가");
  }

  const isNotFavoriteList = favoriteList?.length === 0 || !favoriteList;
  const id = isNotFavoriteList
    ? 1
    : favoriteList[favoriteList?.length - 1]?.id + 1;

  const formatDate = (date: string) => {
    return moment().format("YYYY-MM-DD hh:mm:ss");
  };

  const favorite: Favorite = {
    id,
    favoriteName,
    address,
    createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
    lastVisitedAt: moment().format("YYYY-MM-DD hh:mm:ss"),
    description: "",
    imgHref: "",
    star: false,
    title: "",
    visitedCount: 0,
  };

  return {
    favoriteList,
    favorite,
  };
};
