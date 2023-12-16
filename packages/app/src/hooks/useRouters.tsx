import { useRouter } from "next/router";

export const useRouters = () => {
  const router = useRouter();

  const { pathname } = router;

  const moveHome = () => {
    router.push("/");
  };

  const moveGuest = () => {
    router.push("/guest");
  };

  const moveLogin = () => {
    router.push("/login");
  };

  return {
    pathname,
    moveHome,
    moveGuest,
    moveLogin,
  };
};
