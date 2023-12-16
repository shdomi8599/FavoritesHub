import { ApiResultMessage, Favorite, ResPostFavoritePut } from "@/types";
import { api } from ".";

export const getFavoriteList = async (
  presetId: number,
  accessToken: string,
) => {
  const favorites = await api(`/favorite/list/${presetId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);

  return favorites;
};

export const postFavoriteAdd = async (
  presetId: number,
  favoriteName: string,
  address: string,
  accessToken: string,
) => {
  const body = { favoriteName, address };
  const { message } = await api
    .post<ApiResultMessage>(`/favorite/${presetId}`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);

  return {
    message,
  };
};

export const putFavoriteEdit = async (
  favoriteId: number,
  accessToken: string,
  newFavoriteName: string,
) => {
  const body = { newFavoriteName };
  await api
    .put<ResPostFavoritePut>(`/favorite/${favoriteId}`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};

export const getFavoriteVisited = async (
  favoriteId: number,
  accessToken: string,
) => {
  await api(`/favorite/visited/${favoriteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getFavoriteHandleStar = async (
  favoriteId: number,
  accessToken: string,
) => {
  await api(`/favorite/star/${favoriteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteFavorite = async (
  favoriteId: number,
  accessToken: string,
) => {
  await api.delete(`/favorite/${favoriteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const upVisitedCountFavorite = async (
  favoriteId: number,
  accessToken: string,
) => {
  await api(`/favorite/visitedCount/${favoriteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const guestFavoritesAdd = async (
  favorites: Favorite[],
  mail: string,
  presetName: string,
) => {
  const body = { favorites, mail, presetName };
  const { message } = await api
    .post<ApiResultMessage>(`/guestDataTransfer/`, body)
    .then((res) => res.data);

  return {
    message,
  };
};
