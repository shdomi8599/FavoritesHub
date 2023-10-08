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
import { viewPresetState } from "@/states";
import { confirmAlert } from "@/util";
import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useRecoilState } from "recoil";
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
  const queryClient = useQueryClient();
  const { handleLoginModal } = useAuthModal();
  const { ref: barRef, barHeight } = useBarHeight();
  const isMinWidth600 = useMediaQuery("(min-width:600px)");
  const { addPresetModal, editPresetModal } = usePresetModal();
  const [viewPreset, setViewPreset] = useRecoilState(viewPresetState);

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
    await confirmAlert("정말 삭제하시겠습니까?", "프리셋 삭제가");

    await postPresetDelete(id, accessToken);

    queryClient.invalidateQueries(["presetList", userId]);
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

  useEffect(() => {
    const defaultPreset = presets?.find((preset) => preset.defaultPreset)!;
    setViewPreset(defaultPreset);
  }, [presets, setViewPreset]);

  return (
    <Box sx={{ display: "flex" }}>
      <DashboardBar
        barRef={barRef}
        isLogin={isLogin}
        userMail={userMail}
        barHeight={barHeight}
        toolBarOpen={toolBarOpen}
        isMinWidth600={isMinWidth600}
        logoutEvent={logoutEvent}
        handleDrawer={handleDrawer}
        handleModalOpen={handleLoginModal}
      />
      <DashboardDrawer
        isLogin={isLogin}
        presets={presets!}
        viewPreset={viewPreset}
        toolBarOpen={toolBarOpen}
        logoutEvent={logoutEvent}
        handleDrawer={handleDrawer}
        setViewPreset={setViewPreset}
        addPresetModal={addPresetModal}
        editPresetModal={editPresetModal}
        handleModalOpen={handleLoginModal}
        deletePresetEvent={deletePresetEvent}
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
