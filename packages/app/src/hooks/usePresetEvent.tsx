import {
  postPresetAdd,
  postPresetRelocation,
  putPresetEdit,
} from "@/api/preset";
import { guestPresetAdd, guestPresetEdit } from "@/guest/preset";
import {
  dragPresetDataState,
  isPresetEventState,
  viewPresetState,
} from "@/states";
import { errorAlert, setLocalStorageItem, successAlert } from "@/util";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

type Props = {
  isGuest: boolean;
  accessToken: string;
  selectedPresetId: number;
  offPresetModal: () => void;
  resetPresetList: () => void;
};

export const usePresetEvent = ({
  isGuest,
  accessToken,
  selectedPresetId,
  offPresetModal,
  resetPresetList,
}: Props) => {
  const [isLoding, setIsLoding] = useState(false);
  const setViewPreset = useSetRecoilState(viewPresetState);
  const dragPresetData = useRecoilValue(dragPresetDataState);
  const setIsPresetEvent = useSetRecoilState(isPresetEventState);

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
      setIsLoding(true);
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
      setIsLoding(false);
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
      setIsLoding(true);
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
      setIsLoding(false);
    }
  };

  return { isLoding, presetAdd, presetEdit };
};
