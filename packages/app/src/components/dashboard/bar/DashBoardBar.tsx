/* eslint-disable @next/next/no-img-element */
import { useHandler, useOutSideRef } from "@/hooks";
import { DashBoardChildProps } from "@/types";
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

interface Props extends DashBoardChildProps {
  barHeight: number;
  barRef: MutableRefObject<HTMLDivElement>;
  isMinWidth600: boolean;
  userMail: string;
}

export default function DashboardBar({
  barRef,
  isLogin,
  userMail,
  barHeight,
  toolBarOpen,
  isMinWidth600,
  logoutEvent,
  handleDrawer,
  handleModalOpen,
}: Props) {
  const {
    isBoolean: isOpen,
    handleBoolean: handleOpen,
    offBoolean: offContent,
  } = useHandler(false);
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
        <img src="/logo/logo.png" alt="logo" width={30} height={30} />
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1, ml: 0.5 }}
        >
          Favorites Hub
        </Typography>
        <UserIconBox ref={ref}>
          <IconButton onClick={handleOpen}>
            <AccountCircleIcon sx={{ color: "white" }} fontSize="large" />
          </IconButton>
          {isOpen && (
            <BarUserModal
              userMail={userMail}
              isLogin={isLogin}
              handleOpen={handleOpen}
              contentBoxTop={contentBoxTop}
              handleModalOpen={handleModalOpen}
              logoutEvent={logoutEvent}
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
