import { getAuthRefreshToken, postAuthLogout } from "@/api/auth";
import { postPresetRelocation } from "@/api/preset";
import { useAuth, useBarHeight, useFavoriteEvent } from "@/hooks";
import { usePresetList, useResetQuery } from "@/hooks/react-query";
import { useBreakPoints } from "@/hooks/useBreakPoints";
import { useDashboard } from "@/hooks/useDashboard";
import { useRouters } from "@/hooks/useRouters";
import {
  dragPresetDataState,
  guestPresetsState,
  isGuideModalState,
  isPresetEventState,
  presetLengthState,
  viewPresetState,
} from "@/states";
import {
  deleteCookie,
  errorAlert,
  getCookie,
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/util";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
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
    isGuest,
    accessToken,
    setIsLogin,
    setUserId,
    setUserMail,
    setAccessToken,
  } = useAuth();
  const { setIsDashboard } = useDashboard();
  const { resetPresetList } = useResetQuery();
  const { relocationFavorites } = useFavoriteEvent();
  const { ref: barRef, barHeight } = useBarHeight();
  const { pathname, moveGuest, moveLogin } = useRouters();
  const { isMinWidth600, isMaxWidth900 } = useBreakPoints();

  const setPresetLength = useSetRecoilState(presetLengthState);
  const [viewPreset, setViewPreset] = useRecoilState(viewPresetState);
  const [isGuideModal, setIsGuideModal] = useRecoilState(isGuideModalState);
  const [isPresetEvent, setIsPresetEvent] = useRecoilState(isPresetEventState);

  // 데이터 훅
  const { data: presets } = usePresetList(userId, accessToken);

  // 드래그 프리셋 데이터
  const [dragPresetData, setDragPresetData] =
    useRecoilState(dragPresetDataState);
  useEffect(() => {
    if (!presets?.length) return;
    setDragPresetData(presets);
  }, [presets]);

  // 게스트용 데이터
  const [guestPresets, setGuestPresets] = useRecoilState(guestPresetsState);

  // 이벤트
  const relocationPresetEvent = async () => {
    if (!accessToken || !dragPresetData?.length) return;
    await postPresetRelocation(
      accessToken,
      dragPresetData?.map((preset, index) => {
        const order = index;
        return {
          ...preset,
          order,
        };
      })!,
    );
  };

  const logoutEvent = async () => {
    await relocationPresetEvent();
    const { message } = await postAuthLogout(accessToken);

    if (message === "success") {
      setUserMail("");
      setAccessToken("");
      resetPresetList();
      moveLogin();
    }
  };

  // 이펙트
  useEffect(() => {
    if (accessToken) {
      resetPresetList();
    }
  }, [accessToken]);

  useEffect(() => {
    const relocationEvents = async () => {
      await relocationFavorites();
      await relocationPresetEvent();
    };
    window.addEventListener("beforeunload", relocationEvents);
    return () => {
      window.removeEventListener("beforeunload", relocationEvents);
    };
  }, [relocationPresetEvent, relocationFavorites]);

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
    if (!presets?.length) {
      return;
    }
    setViewPreset(presets[0]);

    if (isPresetEvent) {
      const findViewPreset = presets.find(
        (preset) => preset.id === viewPreset.id,
      );

      if (findViewPreset) {
        setViewPreset(currentViewPreset);
        return;
      }
      setViewPreset(presets[0]);
    }
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
          barHeight={barHeight}
          isMinWidth600={isMinWidth600}
          logoutEvent={logoutEvent}
        />
        <DashboardDrawer
          presets={isGuest ? guestPresets : dragPresetData!}
          logoutEvent={logoutEvent}
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
