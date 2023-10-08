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
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = {
  handleOpen: () => void;
  handleModalOpen: () => void;
  isLogin: boolean;
  contentBoxTop: number;
  logoutEvent: () => void;
};

export default function BarUserModal({
  handleOpen,
  handleModalOpen,
  isLogin,
  contentBoxTop,
  logoutEvent,
}: Props) {
  return (
    <UserContentBox top={contentBoxTop}>
      <CloseBox>
        <CloseIcon fontSize="large" onClick={handleOpen} />
      </CloseBox>
      <MailBox>shdomi8599@gmail.com</MailBox>
      <AccordionBox disableGutters={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <AccordionTypography>계정 관리</AccordionTypography>
        </AccordionSummary>
        <AccordionDetails>
          <AccordionTypography sx={{ gap: "4px" }}>
            {isLogin ? (
              <>
                <DirectionsRunIcon />
                <span onClick={logoutEvent}>로그아웃</span>
              </>
            ) : (
              <>
                <AccountCircleIcon />
                <span onClick={handleModalOpen}>로그인</span>
              </>
            )}
          </AccordionTypography>
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
  "&>svg": {
    cursor: "pointer",
    padding: "4px",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      borderRadius: "50%",
    },
  },
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
