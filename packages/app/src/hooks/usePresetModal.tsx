import { isPresetModalState, presetModalState } from "@/states";
import { PresetModalState } from "@/types";
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

  const handlePresetModal = (path: PresetModalState) => {
    setPresetModal(path);
  };

  return {
    presetModal,
    isPresetModal,
    offPresetModal,
    openPresetModal,
    setPresetModal,
    handlePresetModal,
    addPresetModal,
  };
};
