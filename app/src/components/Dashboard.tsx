import { useModal } from "@/hooks";
import { useHandleWidth } from "@/hooks/useHandleWidth";
import { isLoginState } from "@/states";
import {
  AccountCircle as AccountCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const navItems = [
  { name: "Admin", route: "/" },
  { name: "Faucet", route: "/" },
  { name: "Mintlist", route: "/" },
];

export default function Dashboard({ children }: { children: ReactNode }) {
  // 훅
  const router = useRouter();
  const { handleOpen } = useModal();
  const { width } = useHandleWidth();

  // 상태
  const [toolBarOpen, setToolBartoolBarOpen] = useState(true);
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

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
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar open={toolBarOpen}>
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
              <AccountCircleIcon fontSize="large" />
            </UserIconBox>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={toolBarOpen}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={handleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav" sx={{ height: "90%" }}>
            {navItems.map(({ name, route }) => (
              <ListItemButton onClick={() => handlePage(route)} key={name}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            ))}
          </List>
          {toolBarOpen && (
            <>
              <Divider />
              <ToolBarLoginBox>
                {isLogin ? (
                  <></>
                ) : (
                  <>
                    <AccountCircleIcon fontSize="large" />
                    <span onClick={handleOpen}>Login</span>
                  </>
                )}
              </ToolBarLoginBox>
            </>
          )}
        </Drawer>
        <Main component="main">{children}</Main>
      </Box>
    </>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    overflow: "hidden",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

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

const ToolBarLoginBox = styled(Box)(() => ({
  minHeight: "3rem",
  padding: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.2rem",
  "& > span": {
    cursor: "pointer",
  },
}));

const UserIconBox = styled(Box)(() => ({
  cursor: "pointer",
}));
