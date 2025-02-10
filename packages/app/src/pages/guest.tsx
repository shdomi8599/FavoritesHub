import { MainContainer } from "@/components/main";
import {
  guestFavoriteDelete,
  guestFavoriteHandleStar,
  guestFavoriteVisited,
  guestUpFavoriteVisited,
} from "@/guest/favorite";
import { guestHandleDefaultPreset } from "@/guest/preset";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";

import {
  guestFavoritesState,
  guestPresetsState,
  isLoadingState,
  viewPresetState,
} from "@/states";
import { Favorite, Preset } from "@/types";
import { callbackSuccessAlert, getLocalStorageItem } from "@/util";
import Head from "next/head";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function Guest() {
  // 상태
  const setIsLoading = useSetRecoilState(isLoadingState);
  const setViewPreset = useSetRecoilState(viewPresetState);
  const { viewPreset } = useFavoriteModal();

  // 데이터
  const [guestFavorites, setGuestFavorites] =
    useRecoilState(guestFavoritesState);
  const favorites = [...guestFavorites];
  const setGuestPresets = useSetRecoilState(guestPresetsState);

  // 로컬 즐겨찾기 이벤트
  const localDeleteFavoriteEvent = async (id: number) => {
    await guestFavoriteDelete(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const localUpFavoriteVisitedCountEvent = async (id: number) => {
    await guestUpFavoriteVisited(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const localFavoriteVisitedEvent = async (id: number) => {
    await guestFavoriteVisited(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const guestFavoriteHandleStarEvent = async (id: number) => {
    await guestFavoriteHandleStar(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const HandleDefaultPreset = async () => {
    if (!viewPreset) {
      return;
    }
    const { id: presetId } = viewPreset;

    const callbackEvent = async () => {
      try {
        setIsLoading(true);
        const result = guestHandleDefaultPreset(presetId);
        if (result) {
          const { newPresetList, findPreset } = result;
          setGuestPresets(newPresetList);
          setViewPreset(findPreset!);
        }
      } finally {
        setIsLoading(false);
      }
    };

    callbackSuccessAlert(
      "기본 프리셋 변경",
      "정말 기본 프리셋을 변경하시겠습니까?",
      callbackEvent,
    );
  };

  useEffect(() => {
    const presets: Preset[] = getLocalStorageItem("presetList");
    if (presets?.length) {
      setViewPreset(presets[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    if (favorites) {
      setGuestFavorites([...favorites]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Favorites Hub - 게스트</title>
      </Head>
      <MainContainer
        favoriteVisited={localFavoriteVisitedEvent}
        deleteFavoriteEvent={localDeleteFavoriteEvent}
        favoriteHandleStar={guestFavoriteHandleStarEvent}
        upFavoriteVisitedCount={localUpFavoriteVisitedCountEvent}
        favorites={favorites}
      />
    </>
  );
}
