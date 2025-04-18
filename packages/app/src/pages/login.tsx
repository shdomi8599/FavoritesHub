import { LoginForm } from "@/components/auth/form";
import { useAuthModal } from "@/hooks/modal";
import { Box, styled } from "@mui/material";
import Head from "next/head";

export default function Login() {
  // 훅
  const { handleAuthModal, openAuthModal } = useAuthModal();

  return (
    <>
      <Head>
        <title>Favorites Hub - 로그인</title>
      </Head>
      <LoginContainer>
        <LoginForm
          openAuthModal={openAuthModal}
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
