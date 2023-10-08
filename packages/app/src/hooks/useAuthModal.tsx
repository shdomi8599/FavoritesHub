import { isAuthModalState } from "@/states";
import { useRecoilState } from "recoil";

export const useAuthModal = () => {
  const [isAuthModal, setIsAuthModal] = useRecoilState(isAuthModalState);
  const openAuthModal = () => setIsAuthModal(true);
  const offAuthModal = () => setIsAuthModal(false);

  return {
    isAuthModal,
    offAuthModal,
    openAuthModal,
  };
};
