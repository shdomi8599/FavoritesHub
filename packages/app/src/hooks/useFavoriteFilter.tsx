import { Favorite } from "@/types";
import { useMemoFavorites } from "./react-query";

type Props = {
  selectValue: string;
  favorites?: Favorite[];
  isStar: boolean;
  tags: string[];
  inputValue: string;
};

export const useFavoriteFilter = ({
  selectValue,
  inputValue,
  favorites,
  isStar,
  tags,
}: Props) => {
  const getFilterData = () => {
    let data: Favorite[] = [];

    if (selectValue === "createdAt") {
      data = favorites?.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })!;
    }

    if (selectValue === "lastVisitedAt") {
      data = favorites?.sort((a, b) => {
        return (
          new Date(b.lastVisitedAt).getTime() -
          new Date(a.lastVisitedAt).getTime()
        );
      })!;
    }

    if (selectValue === "visitedCount") {
      data = favorites?.sort((a, b) => {
        return b.visitedCount - a.visitedCount;
      })!;
    }

    if (isStar) {
      data = favorites?.filter((favorite) => favorite.star)!;
    }

    return data;
  };

  const viewData = getFilterData()?.filter((favorite) => {
    if (tags.length === 0) {
      return favorites;
    }
    const { address, description, favoriteName, title } = favorite;
    const loweredInputValue = inputValue.toLowerCase();
    if (tags.includes("전체")) {
      return (
        address.toLowerCase().includes(loweredInputValue) ||
        description.toLowerCase().includes(loweredInputValue) ||
        favoriteName.toLowerCase().includes(loweredInputValue) ||
        title.toLowerCase().includes(loweredInputValue)
      );
    }
    if (tags.includes("타이틀")) {
      return title.toLowerCase().includes(loweredInputValue);
    }
    if (tags.includes("주소")) {
      return address.toLowerCase().includes(loweredInputValue);
    }
    if (tags.includes("설명")) {
      return description.toLowerCase().includes(loweredInputValue);
    }
    if (tags.includes("별칭")) {
      return favoriteName.toLowerCase().includes(loweredInputValue);
    }
  });

  const { titleItems, descriptionItems, favoriteNameItems, addressItems } =
    useMemoFavorites(viewData!);

  const getAutoBarData = () => {
    const selectedItems = [];
    if (tags.includes("전체")) {
      selectedItems.push(titleItems, descriptionItems, favoriteNameItems);
    } else {
      if (tags.includes("타이틀")) {
        selectedItems.push(titleItems);
      }
      if (tags.includes("주소")) {
        selectedItems.push(addressItems);
      }
      if (tags.includes("설명")) {
        selectedItems.push(descriptionItems);
      }
      if (tags.includes("별칭")) {
        selectedItems.push(favoriteNameItems);
      }
    }
    return selectedItems.flat();
  };

  const autoBarData = getAutoBarData();
  return {
    autoBarData,
    viewData,
  };
};
