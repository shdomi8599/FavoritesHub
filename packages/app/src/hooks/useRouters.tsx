import { isGuideModalState } from "@/states";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";

export const useRouters = () => {
  const setIsGuideModal = useSetRecoilState(isGuideModalState);
  const router = useRouter();

  const { pathname } = router;

  const moveHome = () => {
    router.push("/");
  };

  const moveGuest = () => {
    router.push("/guest");
  };

  const moveLogin = () => {
    setIsGuideModal(false);
    router.push("/login");
  };

  const moveReload = () => {
    router.reload();
  };

  return {
    pathname,
    moveHome,
    moveGuest,
    moveLogin,
    moveReload,
  };
};
