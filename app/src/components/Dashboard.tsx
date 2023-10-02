import {
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

const navItems = [
  { name: "Admin", route: "/" },
  { name: "Faucet", route: "/" },
  { name: "Mintlist", route: "/" },
];

export default function Dashboard({ children }: { children: ReactNode }) {
  // 훅
  const router = useRouter();

  // 상태
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState(true);

  // 핸들러
  const handleDrawer = () => {
    setOpen(!open);
  };

  const handlePage = (route: string) => {
    if (route === router.asPath) {
      return;
    }
    router.push(route);
  };

  // 이펙트
  useEffect(() => {
    // 넓이 핸들러 및 최초 넓이 상태 세팅
    const handleWidth = () => {
      setWidth(window.innerWidth);
    };
    handleWidth();
    window.addEventListener("resize", handleWidth);
    return () => window.removeEventListener("resize", handleWidth);
  }, []);

  useEffect(() => {
    // 넓이가 1500 이하라면 toolbar가 off 되도록
    if (width && width < 1500) {
      setOpen(false);
    }
  }, [width]);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar open={open}>
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
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
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
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
          <List component="nav">
            {navItems.map(({ name, route }) => (
              <ListItemButton onClick={() => handlePage(route)} key={name}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
          </List>
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
