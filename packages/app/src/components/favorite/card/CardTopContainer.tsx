/* eslint-disable @next/next/no-img-element */
import {
  Clear as ClearIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Box, IconButton, styled } from "@mui/material";
var randomColor = require("randomcolor"); // import the script

type Props = {
  title: string;
  star: boolean;
  imgSrc: string;
  favoriteName: string;
  handleStar: () => void;
  deleteEvent: () => void;
};

export default function CardTopContainer({
  star,
  title,
  imgSrc,
  favoriteName,
  handleStar,
  deleteEvent,
}: Props) {
  const isNotImgSrc = imgSrc === "https://";
  return (
    <TopContainer>
      <TopImgBox>
        {isNotImgSrc ? (
          <TopCustomImg>{title[0]}</TopCustomImg>
        ) : (
          <TopImg src={imgSrc} alt="" />
        )}
        <TopNameBox sx={{ fontSize: 14 }}>{favoriteName}</TopNameBox>
      </TopImgBox>
      <TopIconContainer>
        <IconButton onClick={deleteEvent}>
          <ClearIcon />
        </IconButton>
        <IconButton onClick={handleStar}>
          {star ? <StarIcon sx={{ color: "#e96363d2" }} /> : <StarBorderIcon />}
        </IconButton>
      </TopIconContainer>
    </TopContainer>
  );
}

const TopContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const TopImgBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const TopNameBox = styled(Box)(() => ({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const TopImg = styled("img")(() => ({
  width: "2rem",
  height: "2rem",
}));

const TopCustomImg = styled(Box)(() => ({
  width: "2rem",
  height: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: randomColor(),
  borderRadius: "50%",
  color: "white",
  verticalAlign: "center",
  textAlign: "center",
  paddingBottom: "1px",
}));

const TopIconContainer = styled(Box)(() => ({
  minWidth: "72px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
