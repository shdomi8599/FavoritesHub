import { useBarHeight, useHandleOpen } from "@/hooks";
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
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = {
  toolBarOpen: boolean;
  handleDrawer: () => void;
};

export default function DashboardBar({ toolBarOpen, handleDrawer }: Props) {
  const isMinWidth600 = useMediaQuery("min-width:600px");
  const { isOpen, handleOpen } = useHandleOpen();
  const { ref, barHeight } = useBarHeight();
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
        <UserIconBox>
          <AccountCircleIcon
            onClick={handleOpen}
            sx={{ cursor: "pointer" }}
            fontSize="large"
          />
          {isOpen && (
            <UserContentBox
              top={isMinWidth600 ? barHeight - 17 : barHeight - 15}
            >
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
  position: "relative",
  display: "flex",
}));

const UserContentBox = styled(Box)(() => ({
  position: "absolute",
  width: "14vw",
  minWidth: "120px",
  height: "40vh",
  border: "1px solid black",
  right: "0",
}));
