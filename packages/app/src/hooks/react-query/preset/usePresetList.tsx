import { getPresetList } from "@/api/preset";
import { useQuery } from "@tanstack/react-query";

export const usePresetList = (userId: number, accessToken: string) => {
  const data = useQuery(
    ["presetList", userId],
    () => getPresetList(userId, accessToken),
    {
      enabled: !!accessToken,
    },
  );
  return data;
};
