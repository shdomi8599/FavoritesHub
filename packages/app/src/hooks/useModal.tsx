import { isModalState } from "@/states";
import { useRecoilState } from "recoil";

export const useModal = () => {
  const [isModal, setIsModal] = useRecoilState(isModalState);
  const handleOpen = () => setIsModal(true);
  const handleClose = () => setIsModal(false);

  return {
    isModal,
    handleClose,
    handleOpen,
  };
};
