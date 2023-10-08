import { authModalState, isAuthModalState } from "@/states";
import { AuthModalState } from "@/types";
import { useRecoilState, useSetRecoilState } from "recoil";

export const useAuthModal = () => {
  const setAuthModal = useSetRecoilState(authModalState);
  const [isAuthModal, setIsAuthModal] = useRecoilState(isAuthModalState);
  const openAuthModal = () => setIsAuthModal(true);
  const offAuthModal = () => setIsAuthModal(false);

  const handleLoginModal = () => {
    setAuthModal("login");
    openAuthModal();
  };

  const handleAuthModal = (path: AuthModalState) => {
    setAuthModal(path);
  };

  return {
    isAuthModal,
    offAuthModal,
    openAuthModal,
    setAuthModal,
    handleLoginModal,
    handleAuthModal,
  };
};
