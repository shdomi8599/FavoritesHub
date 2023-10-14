import { preloadList } from "@/const";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link rel="icon" href="/logo/favicon.ico" />
        {preloadList.map((url, i) => (
          <link rel="preload" href={url} as="image" key={i} />
        ))}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
