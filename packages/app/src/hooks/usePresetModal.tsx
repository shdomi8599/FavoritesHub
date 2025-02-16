import { postPresetDelete, postPresetRelocation } from "@/api/preset";
import { guestPresetDelete } from "@/guest/preset";
import {
  dragPresetDataState,
  guestFavoritesState,
  guestPresetsState,
  isLoadingState,
  isPresetEventState,
  isPresetModalState,
  presetModalState,
  selectedPresetIdState,
  viewPresetState,
} from "@/states";
import {
  confirmAlert,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/util";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useResetQuery } from "./react-query";
import { useAuth } from "./useAuth";

export const usePresetModal = () => {
  const { isGuest, accessToken } = useAuth();
  const { resetPresetList } = useResetQuery();

  const dragPresetData = useRecoilValue(dragPresetDataState);
  const [presetModal, setPresetModal] = useRecoilState(presetModalState);
  const [isPresetModal, setIsPresetModal] = useRecoilState(isPresetModalState);
  const [guestPresets, setGuestPresets] = useRecoilState(guestPresetsState);

  const setIsLoading = useSetRecoilState(isLoadingState);
  const setViewPreset = useSetRecoilState(viewPresetState);
  const setIsPresetEvent = useSetRecoilState(isPresetEventState);
  const setGuestFavorites = useSetRecoilState(guestFavoritesState);
  const setSelectedPresetId = useSetRecoilState(selectedPresetIdState);

  const openPresetModal = () => setIsPresetModal(true);
  const offPresetModal = () => setIsPresetModal(false);

  const addPresetModal = () => {
    setPresetModal("add");
    openPresetModal();
  };

  const editPresetModal = (id: number) => {
    setSelectedPresetId(id);
    setPresetModal("edit");
    openPresetModal();
  };

  // 이벤트
  const relocationPresetEvent = async () => {
    if (!accessToken || !dragPresetData?.length) return;
    await postPresetRelocation(
      accessToken,
      dragPresetData?.map((preset, index) => {
        const order = index;
        return {
          ...preset,
          order,
        };
      })!,
    );
  };

  const deletePresetEvent = async (id: number) => {
    if (isGuest) {
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
        }
      } finally {
        setIsLoading(false);
        setGuestFavorites([]);
        return;
      }
    }

    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "프리셋 삭제가");
      await relocationPresetEvent();
      await postPresetDelete(id, accessToken);
      setIsPresetEvent(true);
      resetPresetList();
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    presetModal,
    isPresetModal,
    offPresetModal,
    openPresetModal,
    setPresetModal,
    addPresetModal,
    editPresetModal,
    deletePresetEvent,
  };
};
