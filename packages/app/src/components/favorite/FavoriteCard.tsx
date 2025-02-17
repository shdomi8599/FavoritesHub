import { useBreakPoints, useHandler } from "@/hooks/common";
import { useAuth } from "@/hooks/data";
import { useFavoriteEvent } from "@/hooks/event";
import { useGuestFavoriteEvent } from "@/hooks/guest";
import { useFavoriteModal } from "@/hooks/modal";
import { Favorite } from "@/types";
import { extractURLs, formatDate } from "@/util";
import { Card, CardContent, Grid } from "@mui/material";
import "moment/locale/ko";
import { MouseEventHandler } from "react";
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
  const { isGuest } = useAuth();
  const {
    favoriteDeleteGuest,
    favoriteVisitedCountGuest,
    favoriteVisitedGuest,
    favoriteHandleStarGuest,
  } = useGuestFavoriteEvent();

  const {
    favoriteDelete,
    favoriteVisited,
    favoriteHandleStar,
    favoriteVisitedCount,
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

  const openSite = async () => {
    if (isGuest) {
      await favoriteVisitedCountGuest(id);
      await favoriteVisitedGuest(id);
      window.open(address, "_blank");
      return;
    }
    await favoriteVisitedCount(id);
    await favoriteVisited(id);
    window.open(address, "_blank");
  };

  const handleStar: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    if (isGuest) {
      await favoriteHandleStarGuest(id);
      return;
    }
    await favoriteHandleStar(id);
  };

  const deleteEvent: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    if (isGuest) {
      await favoriteDeleteGuest(id);
      return;
    }
    await favoriteDelete(id);
  };

  const editEvent: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    editFavoriteModal(id, favoriteName);
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
              star={star}
              title={title}
              imgSrc={!imgHref ? imgHref : imgSrc}
              favoriteName={favoriteName}
              handleStar={handleStar}
              editEvent={editEvent}
              deleteEvent={deleteEvent}
            />
            <CardMiddleContainer
              title={title}
              address={address}
              description={description}
              formatCreatedAt={formatCreatedAt}
            />
          </CardContent>
          <CardBottomContainer
            visitedCount={visitedCount}
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
            star={star}
            title={title}
            imgSrc={!imgHref ? imgHref : imgSrc}
            favoriteName={favoriteName}
            handleStar={handleStar}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
          <CardMiddleContainer
            title={title}
            address={address}
            description={description}
            formatCreatedAt={formatCreatedAt}
          />
        </CardContent>
        <CardBottomContainer
          visitedCount={visitedCount}
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
