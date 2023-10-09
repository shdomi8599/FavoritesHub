import { Favorite } from "@/types";
import { Card, CardContent, Grid } from "@mui/material";
import moment from "moment";
import "moment/locale/ko";
import {
  CardBottomContainer,
  CardMiddleContainer,
  CardTopContainer,
} from "./card";

type Props = {
  favoriteVisited: (favoriteId: number) => void;
  favoriteHandleStar: (favoriteId: number) => void;
  deleteFavoriteEvent: (favoriteId: number) => void;
  favorite: Favorite;
};

export default function FavoriteCard({
  favorite,
  favoriteVisited,
  favoriteHandleStar,
  deleteFavoriteEvent,
}: Props) {
  const {
    id,
    star,
    path,
    title,
    domain,
    imgHref,
    createdAt,
    description,
    favoriteName,
    lastVisitedAt,
  } = favorite;

  const formatDate = (date: string) => {
    return moment(date).format("YYYY년 MMMM Do, a h:mm:ss");
  };

  const address = `https://${domain + path}`;
  const formatCreatedAt = formatDate(createdAt);
  const formatLastVisitedAt = formatDate(lastVisitedAt);
  const imgSrc = imgHref.includes("https") ? imgHref : `https://${imgHref}`;

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

  return (
    <Grid item xs={12} md={4} lg={3}>
      <Card sx={cardStyle}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", height: 150 }}
        >
          <CardTopContainer
            star={star}
            title={title}
            imgSrc={imgSrc}
            favoriteName={favoriteName}
            handleStar={handleStar}
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

const cardStyle = {
  minWidth: 275,
  height: 200,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};
