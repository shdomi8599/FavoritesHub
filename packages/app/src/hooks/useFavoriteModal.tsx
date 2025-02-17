import {
  favoriteModalState,
  isFavoriteModalState,
  presetLengthState,
  selectedFavoriteIdState,
  selectedFavoriteNameState,
  viewPresetState,
} from "@/states";
import { errorAlert } from "@/util";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export const useFavoriteModal = () => {
  const viewPreset = useRecoilValue(viewPresetState);
  const presetLength = useRecoilValue(presetLengthState);
  const setSelectedFavoriteId = useSetRecoilState(selectedFavoriteIdState);
  const setSelectedFavoriteNameState = useSetRecoilState(
    selectedFavoriteNameState,
  );
  const [favoriteModal, setFavoriteModal] = useRecoilState(favoriteModalState);
  const [isFavoriteModal, setIsFavoriteModal] =
    useRecoilState(isFavoriteModalState);
  const openFavoriteModal = () => setIsFavoriteModal(true);
  const offFavoriteModal = () => setIsFavoriteModal(false);

  const addFavoriteModal = () => {
    if (!presetLength) {
      return errorAlert("프리셋을 추가해주세요.", "즐겨찾기 추가");
    }

    if (!viewPreset) {
      return errorAlert("프리셋을 선택해주세요.", "즐겨찾기 추가");
    }
    setFavoriteModal("add");
    openFavoriteModal();
  };

  const editFavoriteModal = (id: number, name?: string) => {
    setSelectedFavoriteNameState(name || "");
    setSelectedFavoriteId(id);
    setFavoriteModal("edit");
    openFavoriteModal();
  };

  const importFavoritesModal = async () => {
    setFavoriteModal("import");
    openFavoriteModal();
  };

  const exportFavoritesModal = async () => {
    setFavoriteModal("export");
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
    importFavoritesModal,
    exportFavoritesModal,
  };
};
