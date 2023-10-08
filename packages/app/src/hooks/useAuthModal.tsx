import { authModalState, isAuthModalState } from "@/states";
import { AuthModalState } from "@/types";
import { useRecoilState } from "recoil";

export const useAuthModal = () => {
  const [authModal, setAuthModal] = useRecoilState(authModalState);
  const [isAuthModal, setIsAuthModal] = useRecoilState(isAuthModalState);
  const openAuthModal = () => setIsAuthModal(true);
  const offAuthModal = () => setIsAuthModal(false);

  const handleSignUpModal = () => {
    setAuthModal("signUp");
    openAuthModal();
  };

  const handleAuthModal = (path: AuthModalState) => {
    setAuthModal(path);
  };

  return {
    authModal,
    isAuthModal,
    offAuthModal,
    openAuthModal,
    setAuthModal,
    handleAuthModal,
    handleSignUpModal,
  };
};
