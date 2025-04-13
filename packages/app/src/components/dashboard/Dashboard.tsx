import { getAIRecommendation } from "@/api/ai";
import { getAuthRefreshToken } from "@/api/auth";
import {
  useBarHeight,
  useBreakPoints,
  useDashboard,
  useRouters,
} from "@/hooks/common";
import { useAuth } from "@/hooks/data";
import { useFavoriteEvent, usePresetEvent } from "@/hooks/event";
import { useGuestFavoriteEvent } from "@/hooks/guest";
import { usePresetList, useResetQuery } from "@/hooks/react-query";
import {
  aiRecommendationState,
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
import { Alert, Box, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Blind from "../blind/Blind";
import DashboardBar from "./bar/DashBoardBar";
import DashboardDrawer from "./drawer/DashBoardDrawer";

export default function Dashboard({
  children,
  handleMount,
}: {
  children: ReactNode;
  handleMount: () => void;
}) {
  // 일반 상태
  const [isAIRecommend, setIsAIRecommend] = useState(false);
  const closeAIRecommend = () => {
    setIsAIRecommend(false);
  };

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
  const { pathname, moveGuest } = useRouters();
  const { setIsDashboard } = useDashboard();
  const { resetPresetList } = useResetQuery();
  const { ref: barRef, barHeight } = useBarHeight();
  const { presetRelocation } = usePresetEvent();
  const { favoriteRelocation } = useFavoriteEvent();
  const { favoriteRelocationGuest } = useGuestFavoriteEvent();
  const { data: presets } = usePresetList(userId, accessToken);
  const { isMinWidth600, isMaxWidth900 } = useBreakPoints();

  const setPresetLength = useSetRecoilState(presetLengthState);
  const [viewPreset, setViewPreset] = useRecoilState(viewPresetState);
  const [guestPresets, setGuestPresets] = useRecoilState(guestPresetsState);
  const [isGuideModal, setIsGuideModal] = useRecoilState(isGuideModalState);
  const [isPresetEvent, setIsPresetEvent] = useRecoilState(isPresetEventState);
  const [aiRecommendation, setAIRecommendationState] = useRecoilState(
    aiRecommendationState,
  );
  const [dragPresetData, setDragPresetData] =
    useRecoilState(dragPresetDataState);

  const refreshEvent = async () => {
    try {
      const { accessToken, userId, mail } = await getAuthRefreshToken();
      if (!accessToken && !userId && pathname !== "/login") {
        moveGuest();
      }
      setUserId(userId);
      setAccessToken(accessToken!);
      setUserMail(mail);

      // AI 추천 사이트 가져오기
      const aiRecommendation = await getAIRecommendation(accessToken!);
      setAIRecommendationState(aiRecommendation);
    } catch {
      moveGuest();
    } finally {
      handleMount();
    }
  };

  useEffect(() => {
    if (!aiRecommendation) return;
    setIsAIRecommend(true);
  }, [aiRecommendation]);

  useEffect(() => {
    if (!presets?.length) return;
    setDragPresetData(presets);
  }, [presets]);

  // 이펙트
  useEffect(() => {
    if (accessToken) {
      resetPresetList();
    }
  }, [accessToken]);

  useEffect(() => {
    const relocationEvents = async () => {
      if (isGuest) {
        await favoriteRelocationGuest();
      } else {
        await favoriteRelocation();
      }

      await presetRelocation();
    };
    window.addEventListener("beforeunload", relocationEvents);
    return () => {
      window.removeEventListener("beforeunload", relocationEvents);
    };
  }, [presetRelocation, favoriteRelocation, favoriteRelocationGuest]);

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

    refreshEvent();
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
        />
        <DashboardDrawer presets={isGuest ? guestPresets : dragPresetData!} />
        <Main component="main" barheight={barHeight}>
          {children}
        </Main>
        <Snackbar
          sx={{
            background: "white",
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={isAIRecommend}
          onClose={closeAIRecommend}
          autoHideDuration={4000}
        >
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                fontSize: "1.2rem",
              }}
            >
              <span>AI 추천 사이트</span>
              <CustomLink
                href={aiRecommendation}
                target="_blank"
                rel="noopener noreferrer"
              >
                {aiRecommendation}
              </CustomLink>
            </Box>
          </Alert>
        </Snackbar>
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

const CustomLink = styled("a")({
  textDecoration: "underline",
  color: "white",
  cursor: "pointer",
});
