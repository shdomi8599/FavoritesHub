import {
  ApiResultMessage,
  Preset,
  ResPostPresetAdd,
  ResPostPresetPut,
} from "@/types";
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
  const { message, preset } = await api
    .put<ResPostPresetPut>(`/preset/${presetId}`, body, {
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

export const getPresetDefault = async (
  presetId: number,
  accessToken: string,
) => {
  const preset = await api<Preset>(`/preset/default/${presetId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);

  return preset;
};

export const postPresetRelocation = async (
  accessToken: string,
  presets: Preset[],
) => {
  const body = { presets };
  const { message, preset } = await api
    .post(`/preset/relocation`, body, {
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
