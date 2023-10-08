import {
  useApi,
  useAuthModal,
  useBarHeight,
  useHandleWidth,
  useHandler,
} from "@/hooks";
import {
  accessTokenState,
  authModalState,
  isLoginState,
  userIdState,
} from "@/states";
import { ApiResultMessage } from "@/types";
import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { DashboardBar } from "./bar";
import { DashboardDrawer } from "./drawer";

export default function Dashboard({ children }: { children: ReactNode }) {
  // 훅
  const { api } = useApi();
  const router = useRouter();
  const { openAuthModal } = useAuthModal();
  const { width } = useHandleWidth();
  const { ref: barRef, barHeight } = useBarHeight();
  const {
    isBoolean: toolBarOpen,
    setisBoolean: setToolBartoolBarOpen,
    handleBoolean: handleDrawer,
  } = useHandler();
  const isMinWidth600 = useMediaQuery("(min-width:600px)");

  // 상태
  const setAuthModal = useSetRecoilState(authModalState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  // 핸들러
  const handlePage = (route: string) => {
    if (route === router.asPath) {
      return;
    }
    router.push(route);
  };

  const handleLoginModal = () => {
    setAuthModal("login");
    openAuthModal();
  };

  const logoutEvent = async () => {
    const { message } = await api
      .post<ApiResultMessage>("/auth/logout", {
        userId,
      })
      .then((res) => res.data);

    if (message === "success") {
      setAccessToken("");
    }
  };

  // 이펙트
  useEffect(() => {
    if (width < 1500) {
      setToolBartoolBarOpen(false);
    }
  }, [width, setToolBartoolBarOpen]);

  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    } else {
      setUserId(0);
      setIsLogin(false);
    }
  }, [accessToken, setIsLogin, setUserId]);

  return (
    <Box sx={{ display: "flex" }}>
      <DashboardBar
        isLogin={isLogin}
        barRef={barRef}
        barHeight={barHeight}
        handleDrawer={handleDrawer}
        toolBarOpen={toolBarOpen}
        isMinWidth600={isMinWidth600}
        handleModalOpen={handleLoginModal}
        logoutEvent={logoutEvent}
      />
      <DashboardDrawer
        handleDrawer={handleDrawer}
        handleModalOpen={handleLoginModal}
        handlePage={handlePage}
        toolBarOpen={toolBarOpen}
        isLogin={isLogin}
        logoutEvent={logoutEvent}
      />
      <Main component="main" barheight={barHeight}>
        {children}
      </Main>
    </Box>
  );
}

const Main = styled(Box)(({ barheight }: { barheight: number }) => ({
  flexGrow: 1,
  height: "100vh",
  overflow: "auto",
  paddingTop: `${barheight}px`,
  backgroundColor: "#f3f3f3",
}));
