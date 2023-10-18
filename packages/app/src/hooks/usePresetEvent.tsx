import { postPresetAdd, putPresetEdit } from "@/api/preset";
import { isPresetEventState, viewPresetState } from "@/states";
import { Preset } from "@/types";
import {
  errorAlert,
  getLocalStorageItem,
  setLocalStorageItem,
  successAlert,
} from "@/util";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

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
  const setIsPresetEvent = useSetRecoilState(isPresetEventState);
  const presetAdd = async (presetName: string) => {
    if (isGuest) {
      const presetList: Preset[] = getLocalStorageItem("presetList");
      if (presetList?.length === 15) {
        return errorAlert("프리셋은 15개가 최대입니다.", "프리셋 추가");
      }

      const findPreset = presetList?.find(
        (preset) => preset.presetName === presetName,
      );

      if (findPreset) {
        return errorAlert("이미 존재하는 이름입니다.", "프리셋 추가");
      }

      const isNotPresetList = presetList?.length === 0 || !presetList;
      const id = isNotPresetList
        ? 1
        : presetList[presetList?.length - 1]?.id + 1;
      const defaultPreset = isNotPresetList ? true : false;
      const preset = {
        id,
        presetName,
        defaultPreset,
      };

      if (presetList) {
        setLocalStorageItem("presetList", [...presetList, preset]);
      } else {
        setLocalStorageItem("presetList", [preset]);
      }
      successAlert("프리셋이 추가되었습니다.", "프리셋 추가");
      offPresetModal();
      setIsPresetEvent(true);
      setViewPreset(preset!);
      return;
    }

    try {
      setIsLoding(true);
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
      const presetList: Preset[] = getLocalStorageItem("presetList");

      const findPreset = presetList?.find(
        (preset) => preset.id === selectedPresetId,
      );
      if (findPreset?.presetName === newPresetName) {
        return errorAlert(
          "동일한 이름으로는 수정할 수 없습니다.",
          "프리셋 수정",
        );
      }

      const existPreset = presetList?.find(
        (preset) => preset.presetName === newPresetName,
      );
      if (existPreset) {
        return errorAlert(
          "다른 프리셋과 같은 이름으로는 수정할 수 없습니다.",
          "프리셋 수정",
        );
      }

      const newPresetList = presetList.map((preset) => {
        if (preset.id === selectedPresetId) {
          preset.presetName = newPresetName;
        }
        return preset;
      });

      const findNewPreset = presetList?.find(
        (preset) => preset.id === selectedPresetId,
      );

      setLocalStorageItem("presetList", [...newPresetList]);
      successAlert("프리셋이 수정되었습니다.", "프리셋 수정");
      offPresetModal();
      setViewPreset(findNewPreset!);
      setIsPresetEvent(true);
      return;
    }

    try {
      setIsLoding(true);
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
