import { ApiResultMessage } from "@/types";
import { api } from ".";

export const getPresetList = async (userId: number, accessToken: string) => {
  const presets = await api(`/preset/list/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);

  return presets;
};

export const postPresetAdd = async (
  userId: number,
  accessToken: string,
  presetName: string,
) => {
  const body = { presetName };
  const { message } = await api
    .post<ApiResultMessage>(`/preset/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);

  return {
    message,
  };
};

export const postPresetDelete = async (
  presetId: number,
  accessToken: string,
) => {
  await api
    .delete<ApiResultMessage>(`/preset/${presetId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};

export const putPresetEdit = async (
  userId: number,
  presetId: number,
  accessToken: string,
  newPresetName: string,
) => {
  const body = { newPresetName };
  const { message } = await api
    .put<ApiResultMessage>(`/preset/${userId}/${presetId}`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);

  return {
    message,
  };
};
