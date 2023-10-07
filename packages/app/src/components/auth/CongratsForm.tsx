import { AuthProps } from "@/types";
import { confettiRealisticLook } from "@/util";
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
        ㅊㅋㅊㅋ
      </Box>
    </Container>
  );
}
