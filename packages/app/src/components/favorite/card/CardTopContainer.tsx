/* eslint-disable @next/next/no-img-element */
import {
  Clear as ClearIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Box, IconButton, styled } from "@mui/material";

type Props = {
  handleStar: () => void;
  deleteEvent: () => void;
  favoriteName: string;
  imgSrc: string;
  star: boolean;
};

export default function CardTopContainer({
  star,
  imgSrc,
  favoriteName,
  handleStar,
  deleteEvent,
}: Props) {
  return (
    <TopContainer>
      <TopImgBox>
        <TopImg src={imgSrc} alt="" />
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
  gap: "4px",
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

const TopIconContainer = styled(Box)(() => ({
  minWidth: "72px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
