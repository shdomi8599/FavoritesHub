import { MainContainer } from "@/components/main";

import {
  dragFavoriteDataState,
  guestFavoritesState,
  viewPresetState,
} from "@/states";
import { Favorite, Preset } from "@/types";
import { getLocalStorageItem } from "@/util";
import Head from "next/head";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function Guest() {
  const setViewPreset = useSetRecoilState(viewPresetState);
  const [guestFavorites, setGuestFavorites] =
    useRecoilState(guestFavoritesState);

  // 드래그 즐겨찾기 데이터
  const [dragFavoriteData, setDragFavoriteData] = useRecoilState(
    dragFavoriteDataState,
  );

  useEffect(() => {
    if (!guestFavorites?.length) return;
    setDragFavoriteData(guestFavorites || []);
  }, [guestFavorites]);

  useEffect(() => {
    const presets: Preset[] = getLocalStorageItem("presetList");
    if (presets?.length) {
      setViewPreset(presets[0]);
    }
  }, []);

  useEffect(() => {
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    if (favorites) {
      setGuestFavorites([...favorites]);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Favorites Hub - 게스트</title>
      </Head>
      <MainContainer favorites={dragFavoriteData} />
    </>
  );
}
