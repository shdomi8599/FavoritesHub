import { LoginForm } from "@/components/auth/form";
import { MainContainer } from "@/components/main";
import { useAuth, useAuthModal, useFavoriteEvent } from "@/hooks";
import { useFavoriteList, useResetQuery } from "@/hooks/react-query";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { dragFavoriteDataState, isLoadingState } from "@/states";
import { Box, styled } from "@mui/material";
import Head from "next/head";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

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
  const { handleAuthModal, openAuthModal } = useAuthModal();
  const { resetFavoriteList } = useResetQuery(userId);
  const { viewPreset } = useFavoriteModal();

  // 데이터
  const { data: favorites } = useFavoriteList(
    userId,
    viewPreset?.id,
    accessToken,
  );

  // 드래그 즐겨찾기 데이터
  const [dragFavoriteData, setDragFavoriteData] = useRecoilState(
    dragFavoriteDataState,
  );
  useEffect(() => {
    if (!favorites?.length) return;
    setDragFavoriteData(favorites);
  }, [favorites]);

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

  if (!!!accessToken) return <></>;

  return (
    <>
      <Head>
        <title>Favorites Hub</title>
      </Head>
      {isLogin ? (
        <>
          <MainContainer
            favorites={dragFavoriteData}
            favoriteVisited={favoriteVisited}
            favoriteHandleStar={favoriteHandleStar}
            setDragFavoriteData={setDragFavoriteData}
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
