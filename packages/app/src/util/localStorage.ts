import { Favorite, Preset } from "@/types";
import { compress, decompress } from "lz-string";

const setLocalStorageItem = (
  key: string,
  value: Preset[] | Favorite[] | string,
) => {
  localStorage.setItem(key, compress(JSON.stringify(value)));
};

const getLocalStorageItem = (key: string) => {
  const item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(decompress(item));
  }
  return null;
};

const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key);
};

export { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem };
