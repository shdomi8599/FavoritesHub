import { Favorite } from "@/types";
import { Box, Grid } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { SetterOrUpdater } from "recoil";
import FavoriteCard from "../favorite/FavoriteCard";

interface Props {
  dragFavoriteData: Favorite[];
  setDragFavoriteData: SetterOrUpdater<Favorite[]>;
  favoriteVisited: (favoriteId: number) => Promise<void>;
  editFavoriteModal: (favoriteId: number, name?: string) => void;
  favoriteHandleStar: (favoriteId: number) => void;
  deleteFavoriteEvent: (favoriteId: number) => void;
  upFavoriteVisitedCount: (favoriteId: number) => Promise<void>;
  isGrid: boolean;
}

export default function DraggableFavoriteList({
  isGrid,
  dragFavoriteData,
  setDragFavoriteData,
  favoriteVisited,
  favoriteHandleStar,
  deleteFavoriteEvent,
  upFavoriteVisitedCount,
  editFavoriteModal,
}: Props) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(dragFavoriteData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setDragFavoriteData(items);
  };

  if (dragFavoriteData?.length)
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="dragFavoriteDataList"
          // direction="horizontal"
          // type="droppableListItem"
        >
          {(provided: DroppableProvided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {dragFavoriteData.map((favorite, index) => (
                <Draggable
                  index={index}
                  key={favorite.id}
                  draggableId={favorite.id.toString()}
                >
                  {(provided: DraggableProvided) => (
                    <Grid
                      container
                      spacing={4}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <FavoriteCard
                        key={index}
                        isGrid={isGrid}
                        favorite={favorite}
                        editFavoriteModal={editFavoriteModal}
                        favoriteVisited={favoriteVisited}
                        deleteFavoriteEvent={deleteFavoriteEvent}
                        favoriteHandleStar={favoriteHandleStar}
                        upFavoriteVisitedCount={upFavoriteVisitedCount}
                      />
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    );
}
