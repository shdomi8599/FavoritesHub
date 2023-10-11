import { ApiResultMessage, Preset, ResPostPresetAdd } from "@/types";
import { api } from ".";

export const getPresetList = async (accessToken: string) => {
  const presets = await api(`/preset/list`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);

  return presets;
};

export const postPresetAdd = async (
  accessToken: string,
  presetName: string,
) => {
  const body = { presetName };
  const { message, preset } = await api
    .post<ResPostPresetAdd>(`/preset`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);

  return {
    message,
    preset,
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
  presetId: number,
  accessToken: string,
  newPresetName: string,
) => {
  const body = { newPresetName };
  const { message } = await api
    .put<ApiResultMessage>(`/preset/${presetId}`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);

  return {
    message,
  };
};

export const postPresetDefault = async (
  presetId: number,
  accessToken: string,
) => {
  const preset = await api
    .post<Preset>(`/preset/default/${presetId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);

  return preset;
};
