import { useFavoriteEvent, useHandler } from "@/hooks";
import { useBreakPoints } from "@/hooks/useBreakPoints";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { Favorite } from "@/types";
import { extractURLs, formatDate } from "@/util";
import { successToast } from "@/util/alert";
import { Card, CardContent, Grid } from "@mui/material";
import "moment/locale/ko";
import { useState } from "react";
import {
  CardBottomContainer,
  CardMiddleContainer,
  CardTopContainer,
} from "./card";

type Props = {
  favorite: Favorite;
  isGrid: boolean;
  isDrag?: boolean;
};

function FavoriteCard({ isDrag, isGrid, favorite }: Props) {
  const {
    deleteFavoriteEvent,
    favoriteVisited,
    favoriteHandleStar,
    upFavoriteVisitedCount,
  } = useFavoriteEvent();

  const { editFavoriteModal } = useFavoriteModal();

  const { isMaxWidth900 } = useBreakPoints();
  const {
    isBoolean: isHover,
    onBoolean: onHover,
    offBoolean: offHover,
  } = useHandler(false);

  const {
    id,
    star,
    title,
    address,
    imgHref,
    createdAt,
    description,
    visitedCount,
    favoriteName,
    lastVisitedAt,
    order,
  } = favorite;

  const formatCreatedAt = formatDate(createdAt);
  const formatLastVisitedAt = formatDate(lastVisitedAt);
  const imgSrc = imgHref.includes("https")
    ? imgHref
    : `https://${extractURLs(address) + imgHref}`;

  // 클라이언트로 상태 관리
  const [visitCount, setVisitCount] = useState(visitedCount || 0);
  const [isStar, setIsStar] = useState(star || false);

  const openSite = async () => {
    await upFavoriteVisitedCount(id);
    await favoriteVisited(id);
    setVisitCount(visitCount + 1);
    window.open(address, "_blank");
  };

  const handleStar = async () => {
    await favoriteHandleStar(id);
    setIsStar(!isStar);
  };

  const deleteEvent = () => {
    deleteFavoriteEvent(id);
  };

  const editEvent = () => {
    editFavoriteModal(id, favoriteName);
  };

  const copyURL = () => {
    navigator.clipboard.writeText(address);
    successToast("주소가 복사되었습니다.");
  };

  if (isDrag) {
    return (
      <div
        id={`favorite-${order}`}
        className="grid-stack-item"
        gs-no-resize="true"
      >
        <Card
          className="grid-stack-item-content"
          onClick={openSite}
          onMouseEnter={onHover}
          onMouseLeave={offHover}
          raised={isHover}
          sx={cardStyle}
        >
          <CardContent
            id={`favorite-${order}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 120,
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
              WebkitFontSmoothing: "subpixel-antialiased",
            }}
          >
            <CardTopContainer
              id={id}
              title={title}
              isStar={isStar}
              imgSrc={!imgHref ? imgHref : imgSrc}
              favoriteName={favoriteName}
              handleStar={handleStar}
              editEvent={editEvent}
              deleteEvent={deleteEvent}
            />
            <CardMiddleContainer
              title={title}
              copyURL={copyURL}
              address={address}
              description={description}
              formatCreatedAt={formatCreatedAt}
            />
          </CardContent>
          <CardBottomContainer
            visitCount={visitCount}
            formatLastVisitedAt={formatLastVisitedAt}
          />
        </Card>
      </div>
    );
  }

  return (
    <Grid
      sx={{
        paddingTop: isMaxWidth900 ? "16px !important" : "",
      }}
      item
      xs={12}
      md={isGrid ? 12 : 4}
      lg={isGrid ? 12 : 3}
    >
      <Card
        onClick={openSite}
        onMouseEnter={onHover}
        onMouseLeave={offHover}
        raised={isHover}
        sx={cardStyle}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 120,
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            WebkitFontSmoothing: "subpixel-antialiased",
          }}
        >
          <CardTopContainer
            id={id}
            isStar={isStar}
            title={title}
            imgSrc={!imgHref ? imgHref : imgSrc}
            favoriteName={favoriteName}
            handleStar={handleStar}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
          <CardMiddleContainer
            title={title}
            copyURL={copyURL}
            address={address}
            description={description}
            formatCreatedAt={formatCreatedAt}
          />
        </CardContent>
        <CardBottomContainer
          visitCount={visitCount}
          formatLastVisitedAt={formatLastVisitedAt}
        />
      </Card>
    </Grid>
  );
}

export default FavoriteCard;

const cardStyle = {
  minWidth: 275,
  height: 180,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 0.5s",
  cursor: "pointer",
};
