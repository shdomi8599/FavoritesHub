import { postAuthLogout } from "@/api/auth";
import { postPresetDelete } from "@/api/preset";
import {
  useAuth,
  useAuthModal,
  useBarHeight,
  useHandler,
  usePresetModal,
} from "@/hooks";
import { usePresetList } from "@/hooks/react-query";
import { isLoadingState, viewPresetState } from "@/states";
import { confirmAlert } from "@/util";
import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
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
  } = useHandler(true);
  const queryClient = useQueryClient();
  const { handleSignUpModal } = useAuthModal();
  const { ref: barRef, barHeight } = useBarHeight();
  const setIsLoading = useSetRecoilState(isLoadingState);
  const isMinWidth600 = useMediaQuery("(min-width:600px)");
  const isMaxWidth900 = useMediaQuery("(max-width:900px)");
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
    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "프리셋 삭제가");
      await postPresetDelete(id, accessToken);
      queryClient.invalidateQueries(["presetList", userId]);
    } finally {
      setIsLoading(false);
    }
  };

  // 이펙트
  useEffect(() => {
    if (isMaxWidth900) {
      setToolBartoolBarOpen(false);
    }
  }, [isMaxWidth900, setToolBartoolBarOpen]);

  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    } else {
      setUserId(0);
      setIsLogin(false);
    }
  }, [accessToken, setIsLogin, setUserId]);

  useEffect(() => {
    const defaultPreset = presets?.find(({ defaultPreset }) => defaultPreset)!;
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
        handleModalOpen={handleSignUpModal}
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
        handleModalOpen={handleSignUpModal}
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
