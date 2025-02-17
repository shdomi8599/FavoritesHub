import {
  deleteFavorite,
  getFavoriteHandleStar,
  getFavoriteVisited,
  postFavoriteAdd,
  postFavoriteImport,
  postFavoriteRelocation,
  putFavoriteEdit,
  upVisitedCountFavorite,
} from "@/api/favorite";
import {
  accessTokenState,
  dragFavoriteDataState,
  favoriteOrderListState,
  isDisableLayoutUpdateState,
  isLoadingState,
  selectedFavoriteIdState,
  viewPresetState,
} from "@/states";
import { ImportFavorite } from "@/types";
import {
  confirmAlert,
  downloadJsonFile,
  errorAlert,
  successAlert,
} from "@/util";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useFavoriteModal } from "../modal/useFavoriteModal";
import { useResetQuery } from "../react-query";

export const useFavoriteEvent = () => {
  const { resetFavoriteList } = useResetQuery();
  const { offFavoriteModal } = useFavoriteModal();
  const viewPreset = useRecoilValue(viewPresetState);
  const accessToken = useRecoilValue(accessTokenState);
  const dragFavoriteData = useRecoilValue(dragFavoriteDataState);
  const favoriteOrderList = useRecoilValue(favoriteOrderListState);
  const selectedFavoriteId = useRecoilValue(selectedFavoriteIdState);
  const id = viewPreset?.id;

  const setIsLoading = useSetRecoilState(isLoadingState);
  const setIsDisableLayoutUpdate = useSetRecoilState(
    isDisableLayoutUpdateState,
  );

  const favoriteAdd = async (favoriteName: string, address: string) => {
    try {
      setIsLoading(true);
      await favoriteRelocation();
      const { message } = await postFavoriteAdd(
        viewPreset?.id,
        favoriteName,
        address,
        accessToken,
      );

      if (message === "not exact") {
        return errorAlert("도메인이 유효하지 않습니다.", "즐겨찾기 추가");
      }

      if (message === "cors") {
        return errorAlert(
          "주소 오류로 인해 등록할 수 없습니다.",
          "즐겨찾기 추가",
        );
      }

      if (message === "exist") {
        return errorAlert("이미 존재하는 주소입니다.", "즐겨찾기 추가");
      }

      if (message === "success") {
        resetFavoriteList(viewPreset?.id);
        offFavoriteModal();
        successAlert("즐겨찾기가 추가되었습니다.", "즐겨찾기 추가");
      }
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const favoriteEdit = async (favoriteName: string) => {
    try {
      setIsLoading(true);
      await putFavoriteEdit(selectedFavoriteId, accessToken, favoriteName);
      await favoriteRelocation();

      setIsDisableLayoutUpdate(true);
      resetFavoriteList(viewPreset?.id);
      offFavoriteModal();
      successAlert(
        "즐겨찾기 별칭 수정이 완료되었습니다.",
        "즐겨찾기 별칭 수정",
      );
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        setIsDisableLayoutUpdate(false);
      }, 500);
    }
  };

  const favoriteDelete = async (favoriteId: number) => {
    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "즐겨찾기 삭제가");
      await favoriteRelocation();
      await deleteFavorite(id, favoriteId, accessToken);
      resetFavoriteList(id);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const favoriteVisited = async (favoriteId: number) => {
    try {
      setIsDisableLayoutUpdate(true);
      await favoriteRelocation();
      await getFavoriteVisited(favoriteId, accessToken);
      resetFavoriteList(id);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setTimeout(() => {
        setIsDisableLayoutUpdate(false);
      }, 500);
    }
  };

  const favoriteHandleStar = async (favoriteId: number) => {
    try {
      setIsDisableLayoutUpdate(true);
      await favoriteRelocation();
      await getFavoriteHandleStar(favoriteId, accessToken);
      resetFavoriteList(id);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setTimeout(() => {
        setIsDisableLayoutUpdate(false);
      }, 500);
    }
  };

  const favoriteVisitedCount = async (id: number) => {
    try {
      setIsDisableLayoutUpdate(true);
      await favoriteRelocation();
      await upVisitedCountFavorite(id, accessToken);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setTimeout(() => {
        setIsDisableLayoutUpdate(false);
      }, 500);
    }
  };

  const favoriteRelocation = async () => {
    const currentPresetId = viewPreset?.id;

    const orderList = favoriteOrderList.map(({ id, order }) => ({ id, order }));
    const sortedDragFavoriteData = dragFavoriteData
      .slice()
      .sort((a, b) => a.order - b.order);

    const isSameOrder = sortedDragFavoriteData.every(
      ({ id, order }, index) =>
        id === orderList[index]?.id && order === orderList[index]?.order,
    );

    if (isSameOrder) return;

    try {
      await postFavoriteRelocation(currentPresetId, orderList, accessToken);
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      resetFavoriteList(currentPresetId);
    }
  };

  const favoriteExport = async (checkedItems: boolean[]) => {
    setIsLoading(true);
    try {
      await confirmAlert(
        "즐겨찾기 추출을 진행하시겠습니까?",
        "즐겨찾기 추출이",
      );

      const selectedFavorites = dragFavoriteData.filter(
        (_, index) => checkedItems[index],
      );

      const resetFavorites = selectedFavorites.map((favorite) => {
        return {
          ...favorite,
          id: 0,
          visitedCount: 0,
          createdAt: "",
          lastVisitedAt: "",
        };
      });
      downloadJsonFile(resetFavorites, "favorites");
      offFavoriteModal();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const favoriteImport = async (fileData: ImportFavorite[]) => {
    setIsLoading(true);
    try {
      await confirmAlert(
        "즐겨찾기 삽입을 진행하시겠습니까?",
        "즐겨찾기 삽입이",
      );
      await postFavoriteImport(viewPreset.id, fileData, accessToken);
      resetFavoriteList(viewPreset?.id);
      offFavoriteModal();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return {
    favoriteAdd,
    favoriteEdit,
    favoriteDelete,
    favoriteVisited,
    favoriteHandleStar,
    favoriteVisitedCount,
    favoriteRelocation,
    favoriteExport,
    favoriteImport,
  };
};
