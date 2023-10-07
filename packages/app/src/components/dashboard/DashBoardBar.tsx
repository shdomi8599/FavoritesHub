import { useHandler, useOutSideRef } from "@/hooks";
import {
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MutableRefObject } from "react";
import BarUserModal from "./BarUserModal";

type Props = {
  toolBarOpen: boolean;
  handleDrawer: () => void;
  barHeight: number;
  barRef: MutableRefObject<HTMLDivElement>;
  isMinWidth600: boolean;
  isLogin: boolean;
  handleModalOpen: () => void;
};

export default function DashboardBar({
  barRef,
  barHeight,
  toolBarOpen,
  handleDrawer,
  handleModalOpen,
  isMinWidth600,
  isLogin,
}: Props) {
  const {
    isBoolean: isOpen,
    handleBoolean: handleOpen,
    offBoolean: offContent,
  } = useHandler();
  const { ref } = useOutSideRef(offContent);
  const contentBoxTop = isMinWidth600 ? barHeight - 27 : barHeight - 25;
  return (
    <Container ref={barRef} open={toolBarOpen}>
      <Toolbar
        sx={{
          pr: "24px",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toolBarOpen drawer"
          onClick={handleDrawer}
          sx={{
            marginRight: "36px",
            ...(toolBarOpen && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Project
        </Typography>
        <UserIconBox ref={ref}>
          <AccountCircleIcon
            onClick={handleOpen}
            sx={{ cursor: "pointer" }}
            fontSize="large"
          />
          {isOpen && (
            <BarUserModal
              isLogin={isLogin}
              handleOpen={handleOpen}
              contentBoxTop={contentBoxTop}
              handleModalOpen={handleModalOpen}
            />
          )}
        </UserIconBox>
      </Toolbar>
    </Container>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Container = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  position: "absolute",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const UserIconBox = styled(Box)(() => ({
  position: "relative",
  display: "flex",
}));
