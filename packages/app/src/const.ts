import { RegisterOptions } from "react-hook-form";

export const { NEXT_PUBLIC_BASE_URL } = process.env;

export const preloadList = ["/google/btn-hover.png"];

export const mainBlueColor = "#1976d2";

export const mainRedColor = "#e26a6ad2";

export const authInputLabel: Record<string, string> = {
  mail: "이메일",
  password: "비밀번호",
  confirmPassword: "비밀번호 확인",
};

export const authFormOptions: Record<string, RegisterOptions> = {
  mail: {
    required: true,
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "입력한 값이 이메일 형식과 일치하지 않습니다.",
    },
  },
  password: {
    required: true,
    pattern: {
      value: /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
      message:
        "비밀번호는 최소 8글자 이상이어야 하며, 대문자와 특수문자를 적어도 1개 이상 포함해야 합니다.",
    },
  },
  verifyCode: {
    required: true,
    pattern: {
      value: /^\d{6}$/,
      message: "인증번호는 6자리의 숫자입니다.",
    },
  },
};

export const presetFormOptions: Record<string, RegisterOptions> = {
  presetName: {
    required: true,
    pattern: {
      value: /^[\p{L}0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20]{1,20}$/iu,
      message:
        "프리셋 이름은 1~20글자 사이의 특수문자가 제외된 문자여야 합니다.",
    },
  },
};

export const favoriteFormOptions: Record<string, RegisterOptions> = {
  favoriteName: {
    pattern: {
      value: /^[\p{L}0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20]{1,20}$/iu,
      message:
        "즐겨찾기 이름은 1~20글자 사이의 특수문자가 제외된 문자여야 합니다.",
    },
  },
  address: {
    required: true,
    pattern: {
      value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[^\s]*)?$/,
      message: "URL주소가 올바르지 않습니다.",
    },
  },
};

export const favoriteEditOptions: Record<string, RegisterOptions> = {
  favoriteName: {
    required: true,
    pattern: {
      value: /^[\p{L}0-9가-힣ㄱ-ㅎㅏ-ㅣ\x20]{1,20}$/iu,
      message:
        "즐겨찾기 이름은 1~20글자 사이의 특수문자가 제외된 문자여야 합니다.",
    },
  },
};

export const SearchTags = ["전체", "별칭", "주소", "타이틀", "설명"];

export const SearchSelects = [
  { label: "등록순", value: "createdAt" },
  { label: "최근 방문순", value: "lastVisitedAt" },
  { label: "방문 횟수순", value: "visitedCount" },
];
