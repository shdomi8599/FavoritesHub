import { getAuthRefreshToken, postAuthLogout } from "@/api/auth";
import { postPresetDelete } from "@/api/preset";
import { guestPresetDelete } from "@/guest/preset";
import { useAuth, useAuthModal, useBarHeight, usePresetModal } from "@/hooks";
import { usePresetList, useResetQuery } from "@/hooks/react-query";
import { useBreakPoints } from "@/hooks/useBreakPoints";
import { useRouters } from "@/hooks/useRouters";
import {
  guestFavoritesState,
  guestPresetsState,
  guideStepState,
  isDashboardState,
  isGuideModalState,
  isLoadingState,
  isPresetEventState,
  presetLengthState,
  viewPresetState,
} from "@/states";
import {
  confirmAlert,
  deleteCookie,
  errorAlert,
  getCookie,
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/util";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Blind from "../blind/Blind";
import { DashboardBar } from "./bar";
import { DashboardDrawer } from "./drawer";

export default function Dashboard({
  children,
  handleMount,
}: {
  children: ReactNode;
  handleMount: () => void;
}) {
  // 훅
  const {
    userId,
    userMail,
    isLogin,
    isGuest,
    accessToken,
    setIsLogin,
    setUserId,
    setUserMail,
    setAccessToken,
  } = useAuth();
  const { pathname, moveGuest, moveLogin } = useRouters();
  const [isGuideModal, setIsGuideModal] = useRecoilState(isGuideModalState);
  const [isDashboard, setIsDashboard] = useRecoilState(isDashboardState);
  const { handleSignUpModal } = useAuthModal();
  const { resetPresetList } = useResetQuery(userId);
  const { ref: barRef, barHeight } = useBarHeight();
  const guideStep = useRecoilValue(guideStepState);
  const setIsLoading = useSetRecoilState(isLoadingState);
  const setPresetLength = useSetRecoilState(presetLengthState);
  const { isMinWidth600, isMaxWidth900 } = useBreakPoints();
  const { addPresetModal, editPresetModal } = usePresetModal();
  const setGuestFavorites = useSetRecoilState(guestFavoritesState);
  const [viewPreset, setViewPreset] = useRecoilState(viewPresetState);
  const [isPresetEvent, setIsPresetEvent] = useRecoilState(isPresetEventState);

  // 데이터 훅
  const { data: presets } = usePresetList(userId, accessToken);

  // 게스트용 데이터
  const [guestPresets, setGuestPresets] = useRecoilState(guestPresetsState);

  // 핸들러
  const handleIsDashboard = () => {
    setIsDashboard(!isDashboard);
  };

  // 이벤트
  const logoutEvent = async () => {
    const { message } = await postAuthLogout(accessToken);

    if (message === "success") {
      setUserMail("");
      setAccessToken("");
      resetPresetList();
      moveLogin();
    }
  };

  const deletePresetEvent = async (id: number) => {
    if (isGuest) {
      try {
        setIsLoading(true);
        await confirmAlert("정말 삭제하시겠습니까?", "프리셋 삭제가");
        const result = guestPresetDelete(guestPresets, id);
        if (result) {
          const { newPreset, findDefaultPreset } = result;
          setLocalStorageItem("presetList", [...newPreset]);
          setGuestPresets([...newPreset]);
          setViewPreset(findDefaultPreset!);
          removeLocalStorageItem("favoriteList");
        }
      } finally {
        setIsLoading(false);
        setGuestFavorites([]);
        return;
      }
    }

    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "프리셋 삭제가");
      await postPresetDelete(id, accessToken);
      resetPresetList();
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 이펙트
  useEffect(() => {
    if (isMaxWidth900) {
      setIsDashboard(false);
    }
  }, [isMaxWidth900, setIsDashboard]);

  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    } else {
      setUserId(0);
      setIsLogin(false);
    }
  }, [accessToken, setIsLogin, setUserId]);

  useEffect(() => {
    setPresetLength(presets?.length || 0);
    const currentViewPreset = viewPreset;
    const defaultPreset = presets?.find(({ defaultPreset }) => defaultPreset)!;
    if (!defaultPreset && presets) {
      setViewPreset(presets[0]);
      return;
    }
    setViewPreset(defaultPreset);
    /**
     * 복잡한 로직이라 코멘트를 남겨놔야 할 듯
     * preset add 이벤트가 일어났을 때, 순간적으로 viewPreset을
     * 새롭게 추가된 프리셋으로 바꾸게 해놓음.
     * 그리고 viewPreset을 새로 추가된 데이터로 변경하기 위해
     * 이펙트 최상단에서 현재 프리셋을 저장하고 만약 preset add가 실제로 일어났다면
     * currentViewPreset을 다시 세팅하도록 해놨음.
     * isPresetEvent상태의 초기화는 새롭게 생겨나는 PresetItem 컴포넌트에 존재하는
     * 이펙트를 통해 초기화 되도록 로직을 구성함
     */
    if (isPresetEvent) {
      setViewPreset(currentViewPreset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presets, setViewPreset]);

  useEffect(() => {
    const isGoogleFailed = getCookie("googleId");
    if (Number(isGoogleFailed) === 1) {
      errorAlert("이미 일반 회원으로 가입된 이메일입니다.", "구글 로그인");
      deleteCookie("googleId");
    }

    getAuthRefreshToken()
      .then((res) => {
        if (res) {
          const { accessToken, userId, mail } = res;

          if (!accessToken && !userId && pathname !== "/login") {
            moveGuest();
          }

          setUserId(userId);
          setAccessToken(accessToken!);
          setUserMail(mail);
        }
      })
      .catch(moveGuest)
      .finally(handleMount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 게스트 용
  useEffect(() => {
    if (isGuest) {
      const presets = getLocalStorageItem("presetList");
      if (presets) {
        setIsPresetEvent(false);
        setGuestPresets([...presets]);
      }
    }
  }, [isGuest, isPresetEvent, setGuestPresets, setIsPresetEvent]);

  useEffect(() => {
    setPresetLength(guestPresets?.length || 0);
  }, [guestPresets, setPresetLength]);

  useEffect(() => {
    const presets = getLocalStorageItem("presetList");
    const isViewGuide = getLocalStorageItem("isViewGuide");
    if (!isViewGuide && !presets) {
      setLocalStorageItem("isViewGuide", "true");
      setIsGuideModal(true);
    }
  }, []);

  return (
    <>
      {isGuideModal && <Blind />}
      <Box sx={{ display: "flex" }}>
        <DashboardBar
          barRef={barRef}
          isLogin={isLogin}
          isGuest={isGuest}
          pathname={pathname}
          guideStep={guideStep}
          isGuideModal={isGuideModal}
          userMail={userMail}
          barHeight={barHeight}
          isDashboard={isDashboard}
          isMinWidth600={isMinWidth600}
          moveGuest={moveGuest}
          moveLogin={moveLogin}
          logoutEvent={logoutEvent}
          handleModalOpen={handleSignUpModal}
          handleIsDashboard={handleIsDashboard}
        />
        <DashboardDrawer
          isLogin={isLogin}
          isGuest={isGuest}
          isGuideModal={isGuideModal}
          pathname={pathname}
          guideStep={guideStep}
          presets={isGuest ? guestPresets : presets!}
          viewPreset={viewPreset}
          isDashboard={isDashboard}
          moveGuest={moveGuest}
          moveLogin={moveLogin}
          logoutEvent={logoutEvent}
          setViewPreset={setViewPreset}
          addPresetModal={addPresetModal}
          editPresetModal={editPresetModal}
          handleModalOpen={handleSignUpModal}
          deletePresetEvent={deletePresetEvent}
          handleIsDashboard={handleIsDashboard}
        />
        <Main component="main" barheight={barHeight}>
          {children}
        </Main>
      </Box>
    </>
  );
}

const Main = styled(Box)(({ barheight }: { barheight: number }) => ({
  flexGrow: 1,
  height: "100vh",
  overflow: "auto",
  paddingTop: `${barheight}px`,
  backgroundColor: "#f3f3f3",
}));
