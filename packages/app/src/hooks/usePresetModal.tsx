import { isPresetModalState, presetModalState } from "@/states";
import { useRecoilState } from "recoil";

export const usePresetModal = () => {
  const [presetModal, setPresetModal] = useRecoilState(presetModalState);
  const [isPresetModal, setIsPresetModal] = useRecoilState(isPresetModalState);
  const openPresetModal = () => setIsPresetModal(true);
  const offPresetModal = () => setIsPresetModal(false);

  const addPresetModal = () => {
    setPresetModal("add");
    openPresetModal();
  };

  return {
    presetModal,
    isPresetModal,
    offPresetModal,
    openPresetModal,
    setPresetModal,
    addPresetModal,
  };
};
