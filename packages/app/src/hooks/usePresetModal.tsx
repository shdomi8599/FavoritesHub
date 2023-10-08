import { isPresetModalState } from "@/states";
import { useRecoilState } from "recoil";

export const usePresetModal = () => {
  const [isPresetModal, setIsPresetModal] = useRecoilState(isPresetModalState);
  const openPresetModal = () => setIsPresetModal(true);
  const offPresetModal = () => setIsPresetModal(false);

  return {
    isPresetModal,
    offPresetModal,
    openPresetModal,
  };
};
