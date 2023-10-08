import {
  isPresetModalState,
  presetModalState,
  selectedPresetIdState,
} from "@/states";
import { useRecoilState, useSetRecoilState } from "recoil";

export const usePresetModal = () => {
  const setSelectedPresetId = useSetRecoilState(selectedPresetIdState);
  const [presetModal, setPresetModal] = useRecoilState(presetModalState);
  const [isPresetModal, setIsPresetModal] = useRecoilState(isPresetModalState);
  const openPresetModal = () => setIsPresetModal(true);
  const offPresetModal = () => setIsPresetModal(false);

  const addPresetModal = () => {
    setPresetModal("add");
    openPresetModal();
  };

  const editPresetModal = (id: number) => {
    setSelectedPresetId(id);
    setPresetModal("edit");
    openPresetModal();
  };

  return {
    presetModal,
    isPresetModal,
    offPresetModal,
    openPresetModal,
    setPresetModal,
    addPresetModal,
    editPresetModal,
  };
};
