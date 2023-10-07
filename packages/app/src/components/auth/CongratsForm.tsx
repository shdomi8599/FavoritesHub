import { AuthProps } from "@/types";
import { confettiRealisticLook } from "@/util";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useEffect } from "react";

export default function CongratsForm({ handleAuthModal }: AuthProps) {
  useEffect(() => {
    confettiRealisticLook();
  }, []);
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" textTransform={"uppercase"}>
          가입을 환영합니다.
        </Typography>
        <Button
          onClick={() => handleAuthModal("login")}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          로그인하러가기
        </Button>
      </Box>
    </Container>
  );
}
