import { Box, styled } from "@mui/material";

const Blind = () => {
  return <Container />;
};

export default Blind;

const Container = styled(Box)(() => ({
  height: "100vh",
  width: "100vw",
  position: "absolute",
  background: "black",
  opacity: "0.3",
  top: "0",
  left: "0",
  zIndex: 1200,
}));
