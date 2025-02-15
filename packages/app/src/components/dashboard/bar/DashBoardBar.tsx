/* eslint-disable @next/next/no-img-element */
import { useAuthModal, useHandler, useOutSideRef } from "@/hooks";
import { useDashboard } from "@/hooks/useDashboard";
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
}

export default function DashboardBar({
  barRef,
  barHeight,
  isMinWidth600,
  logoutEvent,
}: Props) {
  const contentBoxTop = isMinWidth600 ? barHeight - 27 : barHeight - 25;

  const { handleSignUpModal } = useAuthModal();
  const { isDashboard, handleIsDashboard } = useDashboard();
  const {
    isBoolean: isOpen,
    handleBoolean: handleOpen,
    offBoolean: offContent,
  } = useHandler(false);
  const { ref } = useOutSideRef(offContent);

  return (
    <Container ref={barRef} open={isDashboard}>
      <Toolbar
        sx={{
          pr: "24px",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="isDashboard drawer"
          onClick={handleIsDashboard}
          sx={{
            marginRight: "36px",
            ...(isDashboard && { display: "none" }),
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
          <span>Favorites Hub</span>
        </Typography>
        <UserIconBox ref={ref}>
          <IconButton onClick={handleOpen}>
            <AccountCircleIcon sx={{ color: "white" }} fontSize="large" />
          </IconButton>
          {isOpen && (
            <BarUserModal
              contentBoxTop={contentBoxTop}
              handleOpen={handleOpen}
              logoutEvent={logoutEvent}
              handleModalOpen={handleSignUpModal}
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
