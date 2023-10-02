import { useBarHeight, useHandleOpen, useHandleWidth, useModal } from "@/hooks";
import { isLoginState } from "@/states";
import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useRecoilState } from "recoil";
import DashboardBar from "./DashBoardBar";
import DashboardDrawer from "./DashBoardDrawer";

export default function Dashboard({ children }: { children: ReactNode }) {
  // 훅
  const router = useRouter();
  const { handleOpen } = useModal();
  const { width } = useHandleWidth();
  const { ref: barRef, barHeight } = useBarHeight();
  const {
    isOpen: toolBarOpen,
    setIsOpen: setToolBartoolBarOpen,
    handleOpen: handleDrawer,
  } = useHandleOpen();
  const isMinWidth600 = useMediaQuery("(min-width:600px)");

  // 상태
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  const handlePage = (route: string) => {
    if (route === router.asPath) {
      return;
    }
    router.push(route);
  };

  // 이펙트
  useEffect(() => {
    if (width < 1500) {
      setToolBartoolBarOpen(false);
    }
  }, [width, setToolBartoolBarOpen]);

  return (
    <Box sx={{ display: "flex" }}>
      <DashboardBar
        isLogin={isLogin}
        barRef={barRef}
        barHeight={barHeight}
        handleDrawer={handleDrawer}
        toolBarOpen={toolBarOpen}
        isMinWidth600={isMinWidth600}
        handleModalOpen={handleOpen}
      />
      <DashboardDrawer
        handleDrawer={handleDrawer}
        handleModalOpen={handleOpen}
        handlePage={handlePage}
        toolBarOpen={toolBarOpen}
        isLogin={isLogin}
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
