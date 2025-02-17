import { useRouters } from "@/hooks/common/useRouters";
import { useAuth } from "@/hooks/data";
import { useAuthEvent } from "@/hooks/event/useAuthEvent";
import { useAuthModal } from "@/hooks/modal";
import {
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
  DirectionsRun as DirectionsRunIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = {
  contentBoxTop: number;
  handleOpen: () => void;
};

export default function BarUserModal({ contentBoxTop, handleOpen }: Props) {
  const { authLogout } = useAuthEvent();
  const { isLogin, userMail } = useAuth();
  const { handleSignUpModal } = useAuthModal();
  const { pathname, moveGuest, moveLogin } = useRouters();

  return (
    <UserContentBox top={contentBoxTop}>
      <CloseBox>
        <IconButton onClick={handleOpen}>
          <CloseIcon />
        </IconButton>
      </CloseBox>
      <MailBox>
        <Tooltip title={userMail} enterDelay={300}>
          <span>{userMail}</span>
        </Tooltip>
      </MailBox>
      <AccordionBox disableGutters={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <AccordionTypography>계정 관리</AccordionTypography>
        </AccordionSummary>
        <AccordionDetails>
          <CenterBox
            sx={{
              gap: "4px",
            }}
          >
            {isLogin ? (
              <CenterBox onClick={authLogout} sx={{ cursor: "pointer" }}>
                <DirectionsRunIcon />
                <span>로그아웃</span>
              </CenterBox>
            ) : pathname === "/guest" ? (
              <CenterBox
                sx={{
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <CenterBox
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={moveLogin}
                >
                  <AccountCircleIcon fontSize="large" />
                  <span>로그인</span>
                </CenterBox>
                <CenterBox
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={handleSignUpModal}
                >
                  <AccountCircleIcon fontSize="large" />
                  <span>회원가입</span>
                </CenterBox>
              </CenterBox>
            ) : (
              <CenterBox
                sx={{
                  cursor: "pointer",
                }}
                onClick={moveGuest}
              >
                <AccountCircleIcon fontSize="large" />
                <span>게스트</span>
              </CenterBox>
            )}
          </CenterBox>
        </AccordionDetails>
      </AccordionBox>
    </UserContentBox>
  );
}

const UserContentBox = styled(Box)(() => ({
  position: "absolute",
  width: "14vw",
  minWidth: "160px",
  right: "0",
  boxShadow: "rgba(49, 41, 41, 0.35) 0px 2.5px 10px",
  color: "black",
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "6px 12px 12px",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
}));

const CloseBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
}));

const MailBox = styled(Box)(() => ({
  width: "100%",
  textOverflow: "ellipsis",
  padding: "0px 10px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textAlign: "center",
  fontWeight: "600",
  fontSize: "1.1rem",
  marginBottom: "10px",
}));

const AccordionBox = styled(Accordion)(() => ({
  width: "100%",
  boxShadow:
    "0px 2px 1px -1px rgba(0,0,0,0), 0px 1px 1px 0px rgba(0,0,0,0.24), 0px 1px 5px 0px rgba(0,0,0,0.22)",
  "&:before": {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
}));

const AccordionTypography = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& > span": {
    cursor: "pointer",
  },
}));

const CenterBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
}));
