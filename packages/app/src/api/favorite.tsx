import { ApiResultMessage } from "@/types";
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
