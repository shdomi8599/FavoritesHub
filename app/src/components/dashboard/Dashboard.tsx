import { useHandleWidth, useModal } from "@/hooks";
import { isLoginState } from "@/states";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import DashBoardBar from "./DashBoardBar";
import DashBoardDrawer from "./DashBoardDrawer";

export default function Dashboard({ children }: { children: ReactNode }) {
  // 훅
  const router = useRouter();
  const { handleOpen } = useModal();
  const { width } = useHandleWidth();

  // 상태
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const [toolBarOpen, setToolBartoolBarOpen] = useState(true);

  // 핸들러
  const handleDrawer = () => {
    setToolBartoolBarOpen(!toolBarOpen);
  };

  const handlePage = (route: string) => {
    if (route === router.asPath) {
      return;
    }
    router.push(route);
  };

  // 이펙트
  useEffect(() => {
    if (width < 1500) {
      setToolBartoolBarOpen(false);
    }
  }, [width]);

  return (
    <Box sx={{ display: "flex" }}>
      <DashBoardBar handleDrawer={handleDrawer} toolBarOpen={toolBarOpen} />
      <DashBoardDrawer
        handleDrawer={handleDrawer}
        handleOpen={handleOpen}
        handlePage={handlePage}
        toolBarOpen={toolBarOpen}
        isLogin={isLogin}
      />
      <Main component="main">{children}</Main>
    </Box>
  );
}

const Main = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[900],
  flexGrow: 1,
  height: "100vh",
  overflow: "auto",
  paddingTop: "64px",
}));
