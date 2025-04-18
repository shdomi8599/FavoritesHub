import { Preset } from "@/types";
import { errorAlert, getLocalStorageItem, setLocalStorageItem } from "@/util";

export const guestHandleDefaultPreset = (presetId: number) => {
  const presetList: Preset[] = getLocalStorageItem("presetList");
  const findPreset = presetList?.find((preset) => preset.id === presetId);
  const newPresetList = presetList?.filter(
    (preset) => preset.id !== findPreset?.id,
  );

  if (findPreset) {
    newPresetList.unshift(findPreset);
  }

  setLocalStorageItem("presetList", [...newPresetList]);

  return {
    newPresetList,
    findPreset,
  };
};

export const guestPresetAdd = (presetName: string) => {
  const presetList: Preset[] = getLocalStorageItem("presetList");
  if (presetList?.length === 1) {
    return errorAlert("게스트 프리셋은 1개가 최대입니다.", "프리셋 추가");
  }

  const findPreset = presetList?.find(
    (preset) => preset.presetName === presetName,
  );

  if (findPreset) {
    return errorAlert("이미 존재하는 이름입니다.", "프리셋 추가");
  }

  const isNotPresetList = presetList?.length === 0 || !presetList;
  const id = isNotPresetList ? 1 : presetList[presetList?.length - 1]?.id + 1;
  const presetLength = presetList?.length;

  const preset: Preset = {
    id,
    presetName,
    order: presetLength ? presetLength : 0,
  };

  return {
    presetList,
    preset,
  };
};

export const guestPresetEdit = (
  selectedPresetId: number,
  newPresetName: string,
) => {
  const presetList: Preset[] = getLocalStorageItem("presetList");

  const findPreset = presetList?.find(
    (preset) => preset.id === selectedPresetId,
  );
  if (findPreset?.presetName === newPresetName) {
    return errorAlert("동일한 이름으로는 수정할 수 없습니다.", "프리셋 수정");
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

  return {
    newPresetList,
    findNewPreset,
  };
};

export const guestPresetDelete = (guestPresets: Preset[], id: number) => {
  const findPreset = guestPresets.find((preset) => preset.id === id);
  const newPreset = guestPresets.filter(
    (preset) => preset.id !== findPreset?.id,
  );
  return {
    newPreset,
  };
};
