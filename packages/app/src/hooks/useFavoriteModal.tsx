import {
  favoriteModalState,
  isFavoriteModalState,
  selectedFavoriteIdState,
  viewPresetState,
} from "@/states";
import { errorAlert } from "@/util";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export const useFavoriteModal = () => {
  const viewPreset = useRecoilValue(viewPresetState);
  const setSelectedFavoriteId = useSetRecoilState(selectedFavoriteIdState);
  const [favoriteModal, setFavoriteModal] = useRecoilState(favoriteModalState);
  const [isFavoriteModal, setIsFavoriteModal] =
    useRecoilState(isFavoriteModalState);
  const openFavoriteModal = () => setIsFavoriteModal(true);
  const offFavoriteModal = () => setIsFavoriteModal(false);

  const addFavoriteModal = () => {
    if (!viewPreset) {
      return errorAlert("프리셋을 선택해주세요.", "즐겨찾기 추가");
    }
    setFavoriteModal("add");
    openFavoriteModal();
  };

  const editFavoriteModal = (id: number) => {
    setSelectedFavoriteId(id);
    setFavoriteModal("edit");
    openFavoriteModal();
  };

  return {
    viewPreset,
    favoriteModal,
    isFavoriteModal,
    offFavoriteModal,
    openFavoriteModal,
    setFavoriteModal,
    addFavoriteModal,
    editFavoriteModal,
  };
};
