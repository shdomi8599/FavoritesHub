export const navItems = [
  { name: "Admin", route: "/" },
  { name: "Faucet", route: "/" },
  { name: "Mintlist", route: "/" },
];

export const authInputLabel = {
  mail: "이메일",
  password: "비밀번호",
};

export const authFormOptions = {
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
};
