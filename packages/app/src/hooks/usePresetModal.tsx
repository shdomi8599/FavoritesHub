import { isPresetModalState, presetModalState } from "@/states";
import { useRecoilState, useSetRecoilState } from "recoil";

export const usePresetModal = () => {
  const setPresetModal = useSetRecoilState(presetModalState);
  const [isPresetModal, setIsPresetModal] = useRecoilState(isPresetModalState);
  const openPresetModal = () => setIsPresetModal(true);
  const offPresetModal = () => setIsPresetModal(false);

  const addPresetModal = () => {
    setPresetModal("add");
    openPresetModal();
  };

  return {
    isPresetModal,
    offPresetModal,
    openPresetModal,
    setPresetModal,
    addPresetModal,
  };
};
