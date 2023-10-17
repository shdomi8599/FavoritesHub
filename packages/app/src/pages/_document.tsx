import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta
          name="description"
          content="자신만의 즐겨찾기를 등록할 수 있는 FavoritesHub입니다."
        />
        <meta property="og:title" content="FavoritesHub" />
        <meta
          property="og:description"
          content="자신만의 즐겨찾기를 등록할 수 있는 FavoritesHub입니다."
        />
        <meta property="og:image" content="/logo/favicon.ico" />
        <meta property="og:url" content="https://favoriteshub.com/" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FavoritesHub" />
        <meta
          name="twitter:description"
          content="자신만의 즐겨찾기를 등록할 수 있는 FavoritesHub입니다."
        />
        <meta name="twitter:image" content="/logo/favicon.ico" />
        <link rel="canonical" href="https://favoriteshub.com/" />
        <link rel="icon" href="/logo/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
