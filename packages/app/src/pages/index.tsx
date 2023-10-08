import { LoginForm } from "@/components/auth/form";
import FavoriteCard from "@/components/favorite/FavoriteCard";
import { useAuth, useAuthModal } from "@/hooks";
import { isPasswordForgotState, viewPresetState } from "@/states";
import { Box, Grid } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function Main() {
  const {
    userId,
    userMail,
    isLogin,
    accessToken,
    setIsLogin,
    setUserId,
    setUserMail,
    setAccessToken,
  } = useAuth();
  const viewPreset = useRecoilValue(viewPresetState);
  const setIsForgot = useSetRecoilState(isPasswordForgotState);
  const { handleAuthModal, openAuthModal } = useAuthModal();
  return isLogin ? (
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
        setIsForgot={setIsForgot}
        openAuthModal={openAuthModal}
        setAccessToken={setAccessToken}
        handleAuthModal={handleAuthModal}
      />
    </Box>
  );
}
