import {
  deleteFavorite,
  getFavoriteHandleStar,
  getFavoriteVisited,
} from "@/api/favorite";
import { postPresetDefault } from "@/api/preset";
import { LoginForm } from "@/components/auth/form";
import FavoriteCard from "@/components/favorite/FavoriteCard";
import { MainTitle } from "@/components/main";
import { useAuth, useAuthModal } from "@/hooks";
import { useFavoriteList } from "@/hooks/react-query/favorite/useFavoriteList";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { callbackSuccessAlert, confirmAlert } from "@/util";
import { Box, Button, Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const { viewPreset, addFavoriteModal } = useFavoriteModal();
  const { handleAuthModal, openAuthModal } = useAuthModal();

  // 데이터
  const { data } = useFavoriteList(userId, viewPreset?.id, accessToken);

  // 이벤트
  const resetFavoriteList = () => {
    const { id: presetId } = viewPreset;
    queryClient.invalidateQueries(["favoriteList", userId, presetId]);
  };

  const resetPresetList = () => {
    queryClient.invalidateQueries(["presetList", userId]);
  };

  const HandleDefaultPreset = async () => {
    const { id: presetId } = viewPreset;

    const callbackEvent = async () => {
      await postPresetDefault(userId, presetId, accessToken);
      resetPresetList();
    };

    callbackSuccessAlert(
      "기본 프리셋 변경",
      "정말 기본 프리셋을 변경하시겠습니까?",
      callbackEvent,
    );
  };

  const deleteFavoriteEvent = async (favoriteId: number) => {
    await confirmAlert("정말 삭제하시겠습니까?", "즐겨찾기 삭제가");
    await deleteFavorite(favoriteId, accessToken);
    resetFavoriteList();
  };

  const favoriteVisited = async (favoriteId: number) => {
    await getFavoriteVisited(favoriteId, accessToken);
    resetFavoriteList();
  };

  const favoriteHandleStar = async (favoriteId: number) => {
    await getFavoriteHandleStar(favoriteId, accessToken);
    resetFavoriteList();
  };

  return isLogin ? (
    <>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MainTitle
          HandleDefaultPreset={HandleDefaultPreset}
          presetName={viewPreset?.presetName}
          defaultPreset={viewPreset?.defaultPreset}
        />
        <Box>
          <Button
            onClick={addFavoriteModal}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            즐겨찾기 추가하기
          </Button>
        </Box>
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          p: 2,
        }}
      >
        {data &&
          data?.map((favorite, index) => (
            <FavoriteCard
              favorite={favorite}
              key={index}
              favoriteVisited={favoriteVisited}
              favoriteHandleStar={favoriteHandleStar}
              deleteFavoriteEvent={deleteFavoriteEvent}
            />
          ))}
      </Grid>
    </>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90%",
      }}
    >
      <LoginForm
        setUserId={setUserId}
        setUserMail={setUserMail}
        openAuthModal={openAuthModal}
        setAccessToken={setAccessToken}
        handleAuthModal={handleAuthModal}
      />
    </Box>
  );
}
