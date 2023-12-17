import { getPresetDefault } from "@/api/preset";
import { LoginForm } from "@/components/auth/form";
import { MainContainer } from "@/components/main";
import { useAuth, useAuthModal, useFavoriteEvent } from "@/hooks";
import { useFavoriteList, useResetQuery } from "@/hooks/react-query";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { isLoadingState, viewPresetState } from "@/states";
import { callbackSuccessAlert } from "@/util";
import { Box, styled } from "@mui/material";
import Head from "next/head";
import { useSetRecoilState } from "recoil";

export default function Main() {
  // 훅
  const {
    userId,
    isLogin,
    accessToken,
    setUserId,
    setUserMail,
    setAccessToken,
  } = useAuth();
  const setIsLoading = useSetRecoilState(isLoadingState);
  const setViewPreset = useSetRecoilState(viewPresetState);
  const { handleAuthModal, openAuthModal } = useAuthModal();
  const { resetFavoriteList, resetPresetList } = useResetQuery(userId);
  const { viewPreset } = useFavoriteModal();

  // 데이터
  const { data: favorites } = useFavoriteList(
    userId,
    viewPreset?.id,
    accessToken,
  );

  // 이벤트
  const {
    deleteFavoriteEvent,
    favoriteVisited,
    favoriteHandleStar,
    upFavoriteVisitedCount,
  } = useFavoriteEvent({
    id: viewPreset?.id,
    accessToken,
    setIsLoading,
    resetFavoriteList,
  });

  const HandleDefaultPreset = async () => {
    const { id: presetId } = viewPreset;

    const callbackEvent = async () => {
      try {
        setIsLoading(true);
        const preset = await getPresetDefault(presetId, accessToken);
        await resetPresetList();
        setViewPreset(preset);
      } catch (e: any) {
        if (e?.code === 401) {
          location.reload();
        }
      } finally {
        setIsLoading(false);
      }
    };

    callbackSuccessAlert(
      "기본 프리셋 변경",
      "정말 기본 프리셋을 변경하시겠습니까?",
      callbackEvent,
    );
  };

  if (!!!accessToken) return <></>;

  return (
    <>
      <Head>
        <title>Favorites Hub</title>
      </Head>
      {isLogin ? (
        <>
          <MainContainer
            favorites={favorites!}
            HandleDefaultPreset={HandleDefaultPreset}
            favoriteVisited={favoriteVisited}
            favoriteHandleStar={favoriteHandleStar}
            deleteFavoriteEvent={deleteFavoriteEvent}
            upFavoriteVisitedCount={upFavoriteVisitedCount}
          />
        </>
      ) : (
        <LoginContainer>
          <LoginForm
            setUserId={setUserId}
            setUserMail={setUserMail}
            openAuthModal={openAuthModal}
            setAccessToken={setAccessToken}
            handleAuthModal={handleAuthModal}
          />
        </LoginContainer>
      )}
    </>
  );
}

const LoginContainer = styled(Box)(() => ({
  height: "90%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
