import { LoginForm } from "@/components/auth/form";
import { useAuth, useAuthModal } from "@/hooks";
import { Box, styled } from "@mui/material";
import Head from "next/head";

export default function Login() {
  // 훅
  const { setUserId, setUserMail, setAccessToken } = useAuth();
  const { handleAuthModal, openAuthModal } = useAuthModal();

  return (
    <>
      <Head>
        <title>Favorites Hub - 로그인</title>
      </Head>
      <LoginContainer>
        <LoginForm
          setUserId={setUserId}
          setUserMail={setUserMail}
          openAuthModal={openAuthModal}
          setAccessToken={setAccessToken}
          handleAuthModal={handleAuthModal}
        />
      </LoginContainer>
    </>
  );
}

const LoginContainer = styled(Box)(() => ({
  height: "90%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
