﻿# FavoritesHub
FavoritesHub는 사내 업무 효율을 높이기 위해 직접 개발한 툴입니다.

즐겨찾기 링크들을 원하는 프리셋에 맞게 저장할 수 있고, 다양한 필터 기능과 검색 기능을 통해 기록해두었던 링크를 빠르게 찾을 수 있습니다.

## 개발 이유
회사에 입사하기 전부터 느꼈던 것이지만 필요한 정보들을 찾아 활용한 후, 다시 그 정보가 필요해져 찾을 때마다 또 다시 검증의 순간이 필요해서 시간이 낭비되어 왔습니다.
<br/>
<br/>
이 문제를 해결하기 위해 제 손을 통해 한 번이라도 검증된 링크들을 저장할 수 있는 툴을 개발하였습니다. (사실 백엔드 연습도 할겸...)
<br/>

## BookmarkHub가 아닌 FavoritesHub인 이유
즐겨찾기라하면 bookmark 단어를 활용하는게 대중적인데, favorites단어를 사용한 이유는... BookmarkHub라는 도메인이 이미 존재해서 어쩔 수 없었습니다. ㅠㅠ

## 사용한 기술들
패키지 전체 관리는 **yarn**, **lerna**를 활용하여 **monorepo**로 구성하였습니다.
<br/>
<br/>
공통 스택으로는 **TypeScript**
<br/>
<br/>
프론트엔드 스택으로는 **Next.js**, **MUIStyled**, **Recoil**, **React-Query**
<br/>
<br/>
백엔드 스택으로는 **Nest.js**, **MySQL**, **TypeORM**, **JWT**, **Swagger**
<br/>
<br/>
마지막으로 배포는 **오라클 클라우드**를 통해 생성한 인스턴스로 **NGINX**, **PM2**를 활용했습니다.

## 주요 기능
게스트 모드를 통해 로그인 하지 않아도 FavoritesHub의 기능들을 체험할 수 있습니다.
<br/>
<br/>
React-Query의 localStoragePersister를 적극 활용하여, 네트워크 요청을 최소화하고 사용자의 기기에 즐겨찾기 데이터를 캐싱하여 사용자 경험을 향상시켰습니다. (lz-string 라이브러리의 문자열 압축을 활용하여 LocalStorage 용량에 대한 대비를 해두었습니다.)
<br/>
<br/>
구글 로그인과 Refresh토큰을 활용하여 자동로그인이 가능하도록 구현하였습니다.
<br/>
<br/>
