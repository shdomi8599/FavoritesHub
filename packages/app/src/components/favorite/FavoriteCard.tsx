import { Favorite } from "@/types";
import { Card, CardContent, Grid } from "@mui/material";
import moment from "moment";
import "moment/locale/ko";
import { memo } from "react";
import {
  CardBottomContainer,
  CardMiddleContainer,
  CardTopContainer,
} from "./card";

type Props = {
  favoriteVisited: (favoriteId: number) => void;
  editFavoriteModal: (favoriteId: number) => void;
  favoriteHandleStar: (favoriteId: number) => void;
  deleteFavoriteEvent: (favoriteId: number) => void;
  favorite: Favorite;
};

function FavoriteCard({
  favorite,
  favoriteVisited,
  favoriteHandleStar,
  deleteFavoriteEvent,
  editFavoriteModal,
}: Props) {
  const {
    id,
    star,
    title,
    address,
    imgHref,
    createdAt,
    description,
    favoriteName,
    lastVisitedAt,
  } = favorite;

  const formatDate = (date: string) => {
    return moment(date).format("YYYY년 MMMM Do, a h:mm:ss");
  };

  const extractURLs = (text: string) => {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = text.match(urlRegex);

    if (urls) {
      return urls.map((url: string) => {
        if (url.startsWith("https://")) {
          return url.replace("https://", "").split("/")[0];
        } else {
          return url.split("/")[0];
        }
      });
    } else {
      return "";
    }
  };

  const formatCreatedAt = formatDate(createdAt);
  const formatLastVisitedAt = formatDate(lastVisitedAt);
  const imgSrc = imgHref.includes("https")
    ? imgHref
    : `https://${extractURLs(address) + imgHref}`;

  const openSite = () => {
    favoriteVisited(id);
    window.open(address, "_blank");
  };

  const handleStar = () => {
    favoriteHandleStar(id);
  };

  const deleteEvent = () => {
    deleteFavoriteEvent(id);
  };

  const editEvent = () => {
    editFavoriteModal(id);
  };

  return (
    <Grid item xs={12} md={4} lg={3}>
      <Card sx={cardStyle}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", height: 150 }}
        >
          <CardTopContainer
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
          openSite={openSite}
          formatLastVisitedAt={formatLastVisitedAt}
        />
      </Card>
    </Grid>
  );
}

export default memo(FavoriteCard);

const cardStyle = {
  minWidth: 275,
  height: 200,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};
