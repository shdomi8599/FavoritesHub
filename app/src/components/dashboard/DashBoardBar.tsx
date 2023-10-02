import { useDashboardBarHeight, useHandleOpen } from "@/hooks";
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

type Props = {
  toolBarOpen: boolean;
  handleDrawer: () => void;
};

export default function DashboardBar({ toolBarOpen, handleDrawer }: Props) {
  const { ref, dashboardBarHeight } = useDashboardBarHeight();
  const { isOpen, handleOpen } = useHandleOpen();
  console.log(dashboardBarHeight);

  return (
    <Container ref={ref} open={toolBarOpen}>
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
        <UserIconBox onClick={handleOpen}>
          <AccountCircleIcon fontSize="large" />
          {isOpen && (
            <UserContentBox dashboardBarHeight={dashboardBarHeight}>
              zxzxc
            </UserContentBox>
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
  cursor: "pointer",
  position: "relative",
  display: "flex",
}));

type UserContentProps = {
  dashboardBarHeight: number;
};

const UserContentBox = styled(Box)(
  ({ dashboardBarHeight }: UserContentProps) => ({
    position: "absolute",
    width: "14vw",
    height: "40vh",
    border: "1px solid black",
    top: `${dashboardBarHeight}px`,
    right: "0",
  })
);
