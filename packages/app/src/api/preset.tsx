import { api } from ".";

export const getPresetList = (userId: number, accessToken: string) => {
  const presets = api(`/preset/list/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);

  return presets;
};
