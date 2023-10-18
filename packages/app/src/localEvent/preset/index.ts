import { Preset } from "@/types";
import { errorAlert, getLocalStorageItem, setLocalStorageItem } from "@/util";

export const localHandleDefaultPreset = (presetId: number) => {
  const presetList: Preset[] = getLocalStorageItem("presetList");
  const currentDefaultPreset = presetList?.find(
    (preset) => preset.defaultPreset,
  )!;
  currentDefaultPreset.defaultPreset = false;

  const findPreset = presetList?.find((preset) => preset.id === presetId);
  const newPresetList = presetList?.filter(
    (preset) => preset.id !== findPreset?.id,
  );

  if (findPreset) {
    findPreset.defaultPreset = true;
    newPresetList.unshift(findPreset);
  }

  setLocalStorageItem("presetList", [...newPresetList]);

  return {
    newPresetList,
    findPreset,
  };
};

export const localPresetAdd = (presetName: string) => {
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
  const defaultPreset = isNotPresetList ? true : false;
  const preset: Preset = {
    id,
    presetName,
    defaultPreset,
  };

  return {
    presetList,
    preset,
  };
};

export const localPresetEdit = (
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

export const localPresetDelete = (guestPresets: Preset[], id: number) => {
  const findPreset = guestPresets.find((preset) => preset.id === id);
  const newPreset = guestPresets.filter(
    (preset) => preset.id !== findPreset?.id,
  );
  const findDefaultPreset = newPreset.find((preset) => preset.defaultPreset);

  return {
    newPreset,
    findDefaultPreset,
  };
};
