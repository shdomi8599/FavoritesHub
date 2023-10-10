import { Favorite } from "@/types";
import { useMemo } from "react";

export const useMemoFavorites = (data: Favorite[]) => {
  const getUniqueItems = (property: keyof Favorite) => {
    if (!data) {
      return [];
    }

    const uniqueItems = new Set();

    data.forEach((favorite) => {
      const item = favorite[property];
      item && uniqueItems.add(JSON.stringify(item));
    });

    const uniqueItemsArray = [...uniqueItems].map((itemString) =>
      JSON.parse(itemString as string),
    );

    return uniqueItemsArray.map((item) => ({
      label: item,
      value: item,
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const titleItems = useMemo(() => getUniqueItems("title"), [data]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const domainItems = useMemo(() => getUniqueItems("domain"), [data]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const descriptionItems = useMemo(() => getUniqueItems("description"), [data]);
  const favoriteNameItems = useMemo(
    () => getUniqueItems("favoriteName"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  return { titleItems, domainItems, descriptionItems, favoriteNameItems };
};
