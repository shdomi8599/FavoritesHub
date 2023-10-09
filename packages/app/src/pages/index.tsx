import { postPresetDefault } from "@/api/preset";
import { LoginForm } from "@/components/auth/form";
import FavoriteCard from "@/components/favorite/FavoriteCard";
import { MainTitle } from "@/components/main";
import { useAuth, useAuthModal } from "@/hooks";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { viewPresetState } from "@/states";
import { callbackSuccessAlert } from "@/util";
import { Box, Button, Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

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
  const { addFavoriteModal } = useFavoriteModal();
  const viewPreset = useRecoilValue(viewPresetState);
  const { handleAuthModal, openAuthModal } = useAuthModal();

  // 이벤트
  const HandleDefaultPreset = async () => {
    const { id: presetId } = viewPreset;

    const callbackEvent = async () => {
      await postPresetDefault(userId, presetId, accessToken);
      queryClient.invalidateQueries(["presetList", userId]);
    };

    callbackSuccessAlert(
      "기본 프리셋 변경",
      "정말 기본 프리셋을 변경하시겠습니까?",
      callbackEvent,
    );
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
        <FavoriteCard />
        <FavoriteCard />
        <FavoriteCard />
        <FavoriteCard />
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
