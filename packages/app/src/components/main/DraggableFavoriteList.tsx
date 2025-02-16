import { useBreakPoints } from "@/hooks/useBreakPoints";
import {
  dragFavoriteDataState,
  favoriteOrderListState,
  isDisableLayoutUpdateState,
} from "@/states";
import { Favorite } from "@/types";
import { Box } from "@mui/material";
import { GridStack, GridStackNode } from "gridstack";
import "gridstack/dist/gridstack.css";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import FavoriteCard from "../favorite/FavoriteCard";

interface Props {
  isGrid: boolean;
}

export default function DraggableFavoriteList({ isGrid }: Props) {
  const { isMaxWidth900, isMaxWidth1200 } = useBreakPoints();
  const isDiableLayoutUpdate = useRecoilValue(isDisableLayoutUpdateState);
  const [dragFavoriteData, setDragFavoriteData] = useRecoilState(
    dragFavoriteDataState,
  );
  const [favoriteOrderList, setFavoriteOrderList] = useRecoilState<Favorite[]>(
    favoriteOrderListState,
  );

  const gridRef = useRef<GridStack | null>(null);
  const [gridData, setGridData] = useState<any[]>(null!);

  const updateGridLayout = (grid: GridStack, isGrid: boolean) => {
    if (isDiableLayoutUpdate) {
      return;
    }

    /**
     * 로직 정리
     * 1. 기존 아이템들 저장
     * 2. 기존 아이템 모두 삭제
     * 3. 1에서 저장한 아이템들 다시 추가
     * 4. 위치 재배치 후 업데이트하여 적용
     *
     * 이렇게 만든 이유는 즐겨찾기 데이터가 바뀔때마다 기존 아이템들의 잔상이 남았어서
     * 기존 잔상들을 모두 없애고, 새롭게 자리 재배치를 시켜버려서 랜더링 오류를 해결함
     */
    const saveData = grid.getGridItems();

    grid.removeAll();

    saveData.map((item) => {
      grid.makeWidget(item);
    });

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

    grid.batchUpdate();
    grid.commit();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("gridstack").then((module) => {
        const gridInstance = module.GridStack.init({
          cellHeight: 100,
          float: false,
        });
        gridRef.current = gridInstance;
        updateGridLayout(gridInstance, isGrid);

        const savaItems = () => {
          const allItems: any = gridInstance.save();
          setGridData(allItems);
        };

        savaItems();
        gridInstance.on("change", () => savaItems());
      });
    }
  }, []);

  useEffect(() => {
    if (gridData?.length) {
      const sortedGridData = [...gridData].sort((a, b) =>
        a.y === b.y ? a.x - b.x : a.y - b.y,
      );

      const updatedFavorites = dragFavoriteData.map((favorite) => {
        const gridItem = sortedGridData.find((item) =>
          item.content.includes(`favorite-${favorite.order}`),
        );

        if (gridItem) {
          const order = sortedGridData.indexOf(gridItem);
          return { ...favorite, order };
        }

        return favorite;
      });

      setFavoriteOrderList(updatedFavorites.sort((a, b) => a.order - b.order));
    }
  }, [gridData, isGrid]);

  useEffect(() => {
    setDragFavoriteData(favoriteOrderList);
  }, [isGrid]);

  useEffect(() => {
    if (gridRef.current) {
      updateGridLayout(gridRef.current, isGrid);
    }
  }, [isGrid, dragFavoriteData]);

  return (
    <Box className="grid-stack">
      {(dragFavoriteData || []).map((favorite, index) => (
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
