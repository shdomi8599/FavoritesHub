import { postAuthLogout } from "@/api/auth";
import { postPresetDelete } from "@/api/preset";
import {
  useAuth,
  useAuthModal,
  useBarHeight,
  useHandler,
  usePresetModal,
} from "@/hooks";
import { usePresetList, useResetQuery } from "@/hooks/react-query";
import { isLoadingState, isPresetAddState, viewPresetState } from "@/states";
import { confirmAlert } from "@/util";
import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
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
  const { handleSignUpModal } = useAuthModal();
  const { resetPresetList } = useResetQuery(userId);
  const { ref: barRef, barHeight } = useBarHeight();
  const isPresetAdd = useRecoilValue(isPresetAddState);
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
      resetPresetList();
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
    const currentViewPreset = viewPreset;
    const defaultPreset = presets?.find(({ defaultPreset }) => defaultPreset)!;
    if (!defaultPreset && presets) {
      return setViewPreset(presets[0]);
    }
    setViewPreset(defaultPreset);
    /**
     * 복잡한 로직이라 코멘트를 남겨놔야 할 듯
     * preset add 이벤트가 일어났을 때, 순간적으로 viewPreset을
     * 새롭게 추가된 프리셋으로 바꾸게 해놓음.
     * 그리고 viewPreset을 새로 추가된 데이터로 변경하기 위해
     * 이펙트 최상단에서 현재 프리셋을 저장하고 만약 preset add가 실제로 일어났다면
     * currentViewPreset을 다시 세팅하도록 해놨음.
     * isPresetAdd상태의 초기화는 새롭게 생겨나는 PresetItem 컴포넌트에 존재하는
     * 이펙트를 통해 초기화 되도록 로직을 구성함
     */
    if (isPresetAdd) {
      setViewPreset(currentViewPreset);
    }
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
