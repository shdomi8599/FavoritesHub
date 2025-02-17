import { LoginForm } from "@/components/auth/form";
import { MainContainer } from "@/components/main";
import { useAuth, useAuthModal } from "@/hooks";
import { useFavoriteList } from "@/hooks/react-query";
import {
  dragFavoriteDataState,
  favoritesLengthState,
  viewPresetState,
} from "@/states";
import { Box, styled } from "@mui/material";
import Head from "next/head";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default function Main() {
  const { userId, isLogin, accessToken } = useAuth();
  const { handleAuthModal, openAuthModal } = useAuthModal();

  const setFavoritesLength = useSetRecoilState(favoritesLengthState);
  const viewPreset = useRecoilValue(viewPresetState);
  const { data: favorites, refetch } = useFavoriteList(
    userId,
    viewPreset?.id,
    accessToken,
  );

  const [dragFavoriteData, setDragFavoriteData] = useRecoilState(
    dragFavoriteDataState,
  );

  useEffect(() => {
    setDragFavoriteData(favorites || []);
    setFavoritesLength(favorites?.length || 0);
  }, [favorites]);

  useEffect(() => {
    refetch();
  }, []);

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
