import { useBreakPoints } from "@/hooks/common";
import {
  dragFavoriteDataState,
  dragFavoriteIdState,
  dragFavoriteItemState,
  favoriteOrderListState,
  isDisableLayoutUpdateState,
} from "@/states";
import { Box } from "@mui/material";
import { GridItemHTMLElement, GridStack, GridStackNode } from "gridstack";
import "gridstack/dist/gridstack.css";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import FavoriteCard from "./FavoriteCard";

interface Props {
  isGrid: boolean;
}

export default function DraggableFavoriteList({ isGrid }: Props) {
  const { isMaxWidth900, isMaxWidth1200 } = useBreakPoints();
  const dragFavoriteData = useRecoilValue(dragFavoriteDataState);
  const setDragFavoriteId = useSetRecoilState(dragFavoriteIdState);
  const setFavoriteOrderList = useSetRecoilState(favoriteOrderListState);
  const isDiableLayoutUpdate = useRecoilValue(isDisableLayoutUpdateState);

  const gridRef = useRef<GridStack>(null!);
  const [gridData, setGridData] = useState<any[]>(null!);
  const [dragFavoriteItem, setDragFavoriteItemState] =
    useRecoilState<GridItemHTMLElement>(dragFavoriteItemState);

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
  const updateGridLayout = (grid: GridStack, isGrid: boolean) => {
    if (isDiableLayoutUpdate) {
      return;
    }

    const saveData = grid.getGridItems();

    grid.removeAll();

    saveData.map((item) => {
      grid.makeWidget(item);
    });

    const gridWidth = isMaxWidth900 || isGrid ? 12 : isMaxWidth1200 ? 4 : 3;
    const perRow = isGrid ? 1 : 12 / gridWidth;

    grid.getGridItems().map((item) => {
      const id = Number(item.id.slice(9));
      const newNode: Partial<GridStackNode> = {
        w: gridWidth,
        h: 2,
        x: isGrid ? 0 : (id % perRow) * gridWidth,
        y: isGrid ? id * 2 : Math.floor(id / perRow) * 2,
      };
      grid.update(item, newNode);
    });

    grid.batchUpdate();
    grid.commit();
  };

  const updateOrderList = () => {
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
  };

  useEffect(() => {
    if (dragFavoriteItem) {
      const dragFavoriteId = Number(
        dragFavoriteItem.className.split(" ")[0].split("-")[1],
      );
      setDragFavoriteId(dragFavoriteId);
      return;
    }
    setTimeout(() => {
      setDragFavoriteId(0);
    }, 10);
  }, [dragFavoriteItem]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("gridstack").then((module) => {
        const gridInstance = module.GridStack.init({
          cellHeight: 100,
          float: false,
        });
        gridRef.current = gridInstance;
        gridInstance.on("dragstart", (event, el) => {
          setDragFavoriteItemState(el);
        });
        gridInstance.on("dragstop", () => {
          setDragFavoriteItemState(null!);
        });

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
      updateOrderList();
    }
  }, [gridData, isGrid]);

  useEffect(() => {
    if (gridRef.current) {
      updateGridLayout(gridRef.current, isGrid);
    }
  }, [isGrid, dragFavoriteData, isMaxWidth900, isMaxWidth1200]);

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
