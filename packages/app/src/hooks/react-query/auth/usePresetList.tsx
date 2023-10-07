import { useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const usePresetList = (
  api: AxiosInstance,
  accessToken: string,
  userId: number,
) => {
  const data = useQuery(
    ["presetList", userId],
    () => api.post(`/preset/list/${userId}`).then((res) => res.data),
    { enabled: !!accessToken },
  );
  return data;
};
