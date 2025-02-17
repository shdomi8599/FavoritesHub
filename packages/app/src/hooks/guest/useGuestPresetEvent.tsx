import {
  guestPresetAdd,
  guestPresetDelete,
  guestPresetEdit,
} from "@/guest/preset";
import {
  dragFavoriteDataState,
  favoritesLengthState,
  guestFavoritesState,
  guestPresetsState,
  isLoadingState,
  isPresetEventState,
  selectedPresetIdState,
  viewPresetState,
} from "@/states";
import {
  confirmAlert,
  removeLocalStorageItem,
  setLocalStorageItem,
  successAlert,
} from "@/util";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { usePresetModal } from "../usePresetModal";

export const useGuestPresetEvent = () => {
  const { offPresetModal } = usePresetModal();

  const selectedPresetId = useRecoilValue(selectedPresetIdState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [guestPresets, setGuestPresets] = useRecoilState(guestPresetsState);

  const setViewPreset = useSetRecoilState(viewPresetState);
  const setIsPresetEvent = useSetRecoilState(isPresetEventState);
  const setGuestFavorites = useSetRecoilState(guestFavoritesState);
  const setFavoritesLength = useSetRecoilState(favoritesLengthState);
  const setDragFavoriteData = useSetRecoilState(dragFavoriteDataState);

  const presetAddGuest = async (presetName: string) => {
    const result = guestPresetAdd(presetName)!;
    if (result) {
      const { presetList, preset } = result;
      if (presetList) {
        setLocalStorageItem("presetList", [...presetList, preset]);
      } else {
        setLocalStorageItem("presetList", [preset]);
      }
      successAlert("프리셋이 추가되었습니다.", "프리셋 추가");
      offPresetModal();
      setIsPresetEvent(true);
      setViewPreset(preset!);
    }
    return;
  };

  const presetEditGuest = async (newPresetName: string) => {
    const result = guestPresetEdit(selectedPresetId, newPresetName)!;
    if (result) {
      const { newPresetList, findNewPreset } = result;
      setLocalStorageItem("presetList", [...newPresetList]);
      successAlert("프리셋이 수정되었습니다.", "프리셋 수정");
      offPresetModal();
      setViewPreset(findNewPreset!);
      setIsPresetEvent(true);
    }
    return;
  };

  const presetDeleteGuest = async (id: number) => {
    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "프리셋 삭제가");
      const result = guestPresetDelete(guestPresets, id);
      if (result) {
        const { newPreset } = result;
        setLocalStorageItem("presetList", [...newPreset]);
        setGuestPresets([...newPreset]);
        setViewPreset(newPreset[0]);
        removeLocalStorageItem("favoriteList");
        setFavoritesLength(0);
      }
    } finally {
      setIsLoading(false);
      setGuestFavorites([]);
      setDragFavoriteData([]);
      return;
    }
  };

  return {
    isLoading,
    presetAddGuest,
    presetEditGuest,
    presetDeleteGuest,
  };
};
