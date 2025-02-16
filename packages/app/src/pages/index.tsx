import { LoginForm } from "@/components/auth/form";
import { MainContainer } from "@/components/main";
import { useAuth, useAuthModal } from "@/hooks";
import { useFavoriteList } from "@/hooks/react-query";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { dragFavoriteDataState } from "@/states";
import { Box, styled } from "@mui/material";
import Head from "next/head";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function Main() {
  // 훅
  const { userId, isLogin, accessToken } = useAuth();
  const { handleAuthModal, openAuthModal } = useAuthModal();
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
    setDragFavoriteData(favorites || []);
  }, [favorites]);

  if (!!!accessToken) return <></>;

  return (
    <>
      <Head>
        <title>Favorites Hub</title>
      </Head>
      {isLogin ? (
        <>
          <MainContainer favorites={dragFavoriteData} />
        </>
      ) : (
        <LoginContainer>
          <LoginForm
            openAuthModal={openAuthModal}
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
