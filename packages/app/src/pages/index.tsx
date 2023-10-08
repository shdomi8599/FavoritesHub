import { postPresetDefault } from "@/api/preset";
import { LoginForm } from "@/components/auth/form";
import FavoriteCard from "@/components/favorite/FavoriteCard";
import { useAuth, useAuthModal } from "@/hooks";
import { viewPresetState } from "@/states";
import { callbackSuccessAlert } from "@/util";
import {
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
} from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

export default function Main() {
  // 훅
  const {
    userId,
    isLogin,
    userMail,
    accessToken,
    setUserId,
    setUserMail,
    setAccessToken,
  } = useAuth();
  const queryClient = useQueryClient();
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
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Typography
            sx={{
              fontSize: "2rem",
            }}
            noWrap
          >
            {viewPreset.presetName}
          </Typography>
          {viewPreset.defaultPreset ? (
            <Typography
              sx={{
                p: 0.5,
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "50%",
                display: "flex",
              }}
            >
              <StarIcon />
            </Typography>
          ) : (
            <Typography
              onClick={HandleDefaultPreset}
              sx={{
                p: 0.5,
                backgroundColor: "rgb(195, 197, 197)",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <StarOutlineIcon />
            </Typography>
          )}
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
