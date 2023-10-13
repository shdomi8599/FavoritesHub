import { ApiResultAccessToken, ApiResultMessage } from "@/types";
import { api } from ".";

export const postUserExist = async (mail: string) => {
  const user = await api.post("/user/exist", { mail }).then((res) => res.data);
  return user;
};

export const getAuthRefreshToken = async () => {
  const user = await api<ApiResultAccessToken>("/auth/refreshToken", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.data);
  return user;
};

export const postAuthLogin = async (
  username: string,
  password: string,
  isRefreshToken: boolean,
) => {
  try {
    const { accessToken, message, userId } = await api
      .post<ApiResultAccessToken>("/auth/login", {
        username,
        password,
        isRefreshToken,
      })
      .then((res) => res.data);

    return {
      accessToken,
      message,
      userId,
    };
  } catch {
    return {
      accessToken: "",
      message: "not exact",
      userId: 0,
    };
  }
};

export const postAuthLogout = async (accessToken: string) => {
  const { message } = await api
    .delete<ApiResultMessage>("/auth/logout", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);

  return {
    message,
  };
};

export const postAuthMail = async (username: string) => {
  await api.post("/auth/mail", { username });
};

export const postAuthVerify = async (username: string, verifyCode: string) => {
  const { message } = await api
    .post<ApiResultMessage>("/auth/verify", {
      username,
      verifyCode,
    })
    .then((res) => res.data);

  return { message };
};

export const postAuthVerifyLogin = async (
  username: string,
  isRefreshToken: boolean,
) => {
  const { accessToken, userId } = await api
    .post<ApiResultAccessToken>("/auth/verify/login", {
      username,
      isRefreshToken,
    })
    .then((res) => res.data);

  return {
    accessToken,
    userId,
  };
};

export const postSignUp = async (mail: string, password: string) => {
  const { message } = await api
    .post<ApiResultMessage>("/user", { mail, password })
    .then((res) => res.data);

  return {
    message,
  };
};

export const putUpdatePassword = async (username: string, password: string) => {
  const { message } = await api
    .put<ApiResultMessage>("/user", { username, newPassword: password })
    .then((res) => res.data);

  return {
    message,
  };
};

export const getGoogleLogin = async () => {
  const { accessToken, userId, mail } = await api("/auth/google/login").then(
    (res) => res.data,
  );

  return {
    accessToken,
    userId,
    mail,
  };
};
