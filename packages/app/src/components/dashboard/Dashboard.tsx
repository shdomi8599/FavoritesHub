import { postAuthLogout } from "@/api/auth";
import { postPresetDelete } from "@/api/preset";
import {
  useAuth,
  useAuthModal,
  useBarHeight,
  useHandleWidth,
  useHandler,
  usePresetModal,
} from "@/hooks";
import { usePresetList } from "@/hooks/react-query";
import { confirmAlert, errorAlert, successAlert } from "@/util";
import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode, useEffect } from "react";
import { DashboardBar } from "./bar";
import { DashboardDrawer } from "./drawer";

export default function Dashboard({ children }: { children: ReactNode }) {
  // 훅
  const {
    userId,
    userMail,
    isLogin,
    accessToken,
    setIsLogin,
    setUserId,
    setUserMail,
    setAccessToken,
  } = useAuth();
  const {
    isBoolean: toolBarOpen,
    setisBoolean: setToolBartoolBarOpen,
    handleBoolean: handleDrawer,
  } = useHandler();
  const { width } = useHandleWidth();
  const { handleLoginModal } = useAuthModal();
  const { ref: barRef, barHeight } = useBarHeight();
  const { addPresetModal, editPresetModal } = usePresetModal();
  const isMinWidth600 = useMediaQuery("(min-width:600px)");

  // 데이터 훅
  const { data: presets } = usePresetList(userId, accessToken);

  // 이벤트
  const logoutEvent = async () => {
    const { message } = await postAuthLogout(userId);

    if (message === "success") {
      setUserMail("");
      setAccessToken("");
    }
  };

  const deletePresetEvent = async (id: number) => {
    try {
      await confirmAlert("정말 삭제하시겠습니까?", "프리셋 삭제");

      const { message } = await postPresetDelete(id, accessToken);

      if (message === "success") {
        successAlert("프리셋이 삭제되었습니다.", "프리셋 삭제");
      }
    } catch {
      return errorAlert("잠시 후에 다시 시도해주세요.", "프리셋 삭제");
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
        userMail={userMail}
      />
      <DashboardDrawer
        handleDrawer={handleDrawer}
        handleModalOpen={handleLoginModal}
        toolBarOpen={toolBarOpen}
        isLogin={isLogin}
        logoutEvent={logoutEvent}
        addPresetModal={addPresetModal}
        editPresetModal={editPresetModal}
        presets={presets!}
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
