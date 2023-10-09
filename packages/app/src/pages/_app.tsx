import AuthModal from "@/components/auth/AuthModal";
import Dashboard from "@/components/dashboard/Dashboard";
import FavoriteModal from "@/components/favorite/FavoriteModal";
import PresetModal from "@/components/preset/PresetModal";
import "@/styles/globals.css";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { compress, decompress } from "lz-string";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: { queries: { staleTime: Infinity } },
    }),
  );

  useEffect(() => {
    const localStoragePersistor = createSyncStoragePersister({
      storage: window.localStorage,
      serialize: (data) => compress(JSON.stringify(data)),
      deserialize: (data) => JSON.parse(decompress(data)),
    });

    persistQueryClient({
      queryClient: queryClient,
      persister: localStoragePersistor,
      maxAge: Infinity,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Dashboard>
          <FavoriteModal />
          <PresetModal />
          <AuthModal />
          <Component {...pageProps} />
        </Dashboard>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
