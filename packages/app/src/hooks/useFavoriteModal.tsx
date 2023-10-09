import {
  favoriteModalState,
  isFavoriteModalState,
  selectedFavoriteIdState,
} from "@/states";
import { useRecoilState, useSetRecoilState } from "recoil";

export const useFavoriteModal = () => {
  const setSelectedFavoriteId = useSetRecoilState(selectedFavoriteIdState);
  const [favoriteModal, setFavoriteModal] = useRecoilState(favoriteModalState);
  const [isFavoriteModal, setIsFavoriteModal] =
    useRecoilState(isFavoriteModalState);
  const openFavoriteModal = () => setIsFavoriteModal(true);
  const offFavoriteModal = () => setIsFavoriteModal(false);

  const addFavoriteModal = () => {
    setFavoriteModal("add");
    openFavoriteModal();
  };

  const editFavoriteModal = (id: number) => {
    setSelectedFavoriteId(id);
    setFavoriteModal("edit");
    openFavoriteModal();
  };

  return {
    favoriteModal,
    isFavoriteModal,
    offFavoriteModal,
    openFavoriteModal,
    setFavoriteModal,
    addFavoriteModal,
    editFavoriteModal,
  };
};
