/* eslint-disable @next/next/no-img-element */
import {
  Clear as ClearIcon,
  Mode as ModeIcon,
  QuestionMark as QuestionMarkIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip, styled } from "@mui/material";

const randomColorTable: Record<number, string> = {
  1: "#FF5733",
  2: "#33FF57",
  3: "#3366FF",
  4: "#FF33B3",
  5: "#33CCFF",
  6: "#FFCC33",
  7: "#33FFCC",
  8: "#9933FF",
  9: "#FF33CC",
  10: "#66FF33",
};

type Props = {
  id: number;
  title: string;
  star: boolean;
  imgSrc: string;
  favoriteName: string;
  handleStar: () => void;
  deleteEvent: () => void;
  editEvent: () => void;
};

export default function CardTopContainer({
  id,
  star,
  title,
  imgSrc,
  favoriteName,
  editEvent,
  handleStar,
  deleteEvent,
}: Props) {
  const colorId = id % 10;
  return (
    <TopContainer>
      <TopImgBox>
        {!imgSrc ? (
          <TopCustomImg
            sx={{
              backgroundColor: randomColorTable[colorId],
            }}
          >
            {title ? title[0] : <QuestionMarkIcon />}
          </TopCustomImg>
        ) : (
          <TopImg src={imgSrc} alt="" />
        )}
        {favoriteName && (
          <TopNameBox
            title={favoriteName}
            sx={{ fontSize: 14, ml: 1 }}
            enterDelay={300}
          >
            <Box>{favoriteName}</Box>
          </TopNameBox>
        )}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            editEvent();
          }}
        >
          <ModeIcon />
        </IconButton>
      </TopImgBox>
      <TopIconContainer>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            deleteEvent();
          }}
        >
          <ClearIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleStar();
          }}
        >
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
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const TopNameBox = styled(Tooltip)(() => ({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const TopImg = styled("img")(() => ({
  width: "2rem",
  height: "2rem",
}));

const TopCustomImg = styled(Box)(() => ({
  minWidth: "2rem",
  minHeight: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
