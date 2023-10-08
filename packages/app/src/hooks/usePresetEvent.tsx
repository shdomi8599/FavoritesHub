import { postPresetAdd, postPresetDelete, putPresetEdit } from "@/api/preset";
import { errorAlert, successAlert } from "@/util";

type Props = {
  userId: number;
  accessToken: string;
  selectedPresetId: number;
  offPresetModal: () => void;
  resetPresetList: () => void;
};

export const usePresetEvent = ({
  userId,
  accessToken,
  selectedPresetId,
  offPresetModal,
  resetPresetList,
}: Props) => {
  const presetAdd = async (presetName: string) => {
    const { message } = await postPresetAdd(userId, accessToken, presetName);

    if (message === "exist") {
      return errorAlert("이미 존재하는 이름입니다.", "프리셋 추가");
    }

    if (message === "success") {
      offPresetModal();
      resetPresetList();
      successAlert("프리셋이 추가되었습니다.", "프리셋 추가");
    }
  };

  const presetEdit = async (newPresetName: string) => {
    const { message } = await putPresetEdit(
      userId,
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
      return errorAlert("동일한 이름으로는 수정할 수 없습니다.", "프리셋 수정");
    }

    if (message === "success") {
      offPresetModal();
      resetPresetList();
      successAlert("프리셋이 수정되었습니다.", "프리셋 수정");
    }
  };

  const presetDelete = async (presetId: number) => {
    const { message } = await postPresetDelete(presetId, accessToken);

    if (message === "success") {
      offPresetModal();
      resetPresetList();
      successAlert("프리셋이 삭제되었습니다.", "프리셋 삭제");
    }
  };

  return { presetAdd, presetEdit, presetDelete };
};
