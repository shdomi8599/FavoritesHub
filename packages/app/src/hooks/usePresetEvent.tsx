import {
  postPresetAdd,
  postPresetDelete,
  postPresetRelocation,
  putPresetEdit,
} from "@/api/preset";
import {
  guestPresetAdd,
  guestPresetDelete,
  guestPresetEdit,
} from "@/guest/preset";
import {
  dragPresetDataState,
  guestFavoritesState,
  guestPresetsState,
  isLoadingState,
  isPresetEventState,
  isPresetModalState,
  selectedPresetIdState,
  viewPresetState,
} from "@/states";
import {
  confirmAlert,
  errorAlert,
  removeLocalStorageItem,
  setLocalStorageItem,
  successAlert,
} from "@/util";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useResetQuery } from "./react-query";
import { useAuth } from "./useAuth";

export const usePresetEvent = () => {
  const { isGuest, userId, accessToken } = useAuth();
  const { resetPresetList } = useResetQuery(userId);

  const dragPresetData = useRecoilValue(dragPresetDataState);
  const selectedPresetId = useRecoilValue(selectedPresetIdState);

  const setViewPreset = useSetRecoilState(viewPresetState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const setIsPresetEvent = useSetRecoilState(isPresetEventState);
  const setGuestFavorites = useSetRecoilState(guestFavoritesState);
  const [guestPresets, setGuestPresets] = useRecoilState(guestPresetsState);

  const setIsPresetModal = useSetRecoilState(isPresetModalState);

  const offPresetModal = () => setIsPresetModal(false);

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

  const presetAdd = async (presetName: string) => {
    if (isGuest) {
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
    }

    try {
      setIsLoading(true);
      await relocationPresetEvent();
      const { message, preset } = await postPresetAdd(accessToken, presetName);

      if (message === "max") {
        return errorAlert("프리셋은 15개가 최대입니다.", "프리셋 추가");
      }

      if (message === "exist") {
        return errorAlert("이미 존재하는 이름입니다.", "프리셋 추가");
      }

      setIsPresetEvent(true);
      offPresetModal();
      resetPresetList();
      successAlert("프리셋이 추가되었습니다.", "프리셋 추가");
      setViewPreset(preset!);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const presetEdit = async (newPresetName: string) => {
    if (isGuest) {
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
    }

    try {
      setIsLoading(true);
      await relocationPresetEvent();
      const { message, preset } = await putPresetEdit(
        selectedPresetId,
        accessToken,
        newPresetName,
      );

      if (message === "exist") {
        return errorAlert(
          "다른 프리셋과 같은 이름으로는 수정할 수 없습니다.",
          "프리셋 수정",
        );
      }

      if (message === "same") {
        return errorAlert(
          "동일한 이름으로는 수정할 수 없습니다.",
          "프리셋 수정",
        );
      }

      if (message === "success") {
        setIsPresetEvent(true);
        offPresetModal();
        resetPresetList();
        successAlert("프리셋이 수정되었습니다.", "프리셋 수정");
        setViewPreset(preset!);
      }
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const presetDelete = async (id: number) => {
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

  return { isLoading, presetAdd, presetEdit, presetDelete };
};
