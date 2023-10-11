import { getPresetList } from "@/api/preset";
import { Preset } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const usePresetList = (userId: number, accessToken: string) => {
  const data = useQuery<Preset[]>(
    ["presetList", userId],
    () => getPresetList(accessToken),
    {
      enabled: !!accessToken,
    },
  );
  return data || [];
};
