import {
  postPresetAdd,
  postPresetDelete,
  postPresetRelocation,
  putPresetEdit,
} from "@/api/preset";
import {
  dragPresetDataState,
  isLoadingState,
  isPresetEventState,
  selectedPresetIdState,
  viewPresetState,
} from "@/states";
import { confirmAlert, errorAlert, successAlert } from "@/util";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useResetQuery } from "./react-query";
import { useAuth } from "./useAuth";
import { usePresetModal } from "./usePresetModal";

export const usePresetEvent = () => {
  const { accessToken } = useAuth();
  const { offPresetModal } = usePresetModal();
  const { resetPresetList } = useResetQuery();

  const dragPresetData = useRecoilValue(dragPresetDataState);
  const selectedPresetId = useRecoilValue(selectedPresetIdState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

  const setViewPreset = useSetRecoilState(viewPresetState);
  const setIsPresetEvent = useSetRecoilState(isPresetEventState);

  const presetRelocation = async () => {
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
    try {
      setIsLoading(true);
      await presetRelocation();
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
    try {
      setIsLoading(true);
      await presetRelocation();
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
    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "프리셋 삭제가");
      await presetRelocation();
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
    isLoading,
    presetAdd,
    presetEdit,
    presetDelete,
    presetRelocation,
  };
};
