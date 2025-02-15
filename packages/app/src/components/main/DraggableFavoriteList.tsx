import { Favorite } from "@/types";
import { Box } from "@mui/material";
import { GridStack, GridStackNode } from "gridstack";
import "gridstack/dist/gridstack.css";
import { useEffect, useRef, useState } from "react";
import { SetterOrUpdater } from "recoil";
import FavoriteCard from "../favorite/FavoriteCard";

interface Props {
  selectValue: string;
  dragFavoriteData: Favorite[];
  setDragFavoriteData: SetterOrUpdater<Favorite[]>;
  isGrid: boolean;
}

export default function DraggableFavoriteList({
  isGrid,
  selectValue,
  dragFavoriteData,
  setDragFavoriteData,
}: Props) {
  console.log(dragFavoriteData);
  const [orderList, setOrderList] = useState<Favorite[]>(null!);
  const [gridData, setGridData] = useState<any[]>(null!);
  const gridRef = useRef<GridStack | null>(null);

  useEffect(() => {
    console.log(orderList);
  }, [orderList]);

  useEffect(() => {
    if (orderList?.length) {
      // setDragFavoriteData(orderList);
    }
  }, [selectValue, orderList]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("gridstack").then((module) => {
        const gridInstance = module.GridStack.init({
          cellHeight: 100,
          float: false,
        });
        gridRef.current = gridInstance;
        updateGridLayout(gridInstance, isGrid);

        gridInstance.on("change", () => {
          const allItems: any = gridInstance.save();
          setGridData(allItems);
        });
      });
    }
  }, []);

  useEffect(() => {
    if (gridData?.length) {
      const updatedFavorites = dragFavoriteData.map((favorite) => {
        const gridItem = gridData.find((item) =>
          item.content.includes(`favorite-${favorite.order}`),
        );

        if (gridItem) {
          return {
            ...favorite,
            order: (gridItem.y / 2) * 4 + gridItem.x / 3,
          };
        }
        return favorite;
      });

      setOrderList(updatedFavorites.sort((a, b) => a.order - b.order));
    }
  }, [gridData, isGrid]);

  useEffect(() => {
    if (gridRef.current) {
      updateGridLayout(gridRef.current, isGrid);
    }
  }, [isGrid, dragFavoriteData]);

  const updateGridLayout = (grid: GridStack, isGrid: boolean) => {
    grid.batchUpdate();

    grid.getGridItems().map((item) => {
      const id = Number(item.id.slice(9));
      const newNode: Partial<GridStackNode> = {
        w: !isGrid ? 3 : 12,
        h: 2,
        x: !isGrid ? (id % 4) * 3 : 0,
        y: !isGrid ? Math.floor(id / 4) * 2 : id * 2,
      };

      grid.update(item, newNode);
    });

    grid.commit();
  };

  return (
    <Box className="grid-stack">
      {dragFavoriteData.map((favorite, index) => (
        <FavoriteCard
          key={index}
          isDrag={true}
          isGrid={isGrid}
          favorite={favorite}
        />
      ))}
    </Box>
  );
}
