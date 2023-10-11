import { ApiResultAccessToken, ApiResultMessage } from "@/types";
import { api } from ".";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return (parts as any).pop().split(";").shift();
}

export const postUserExist = async (mail: string) => {
  const user = await api.post("/user/exist", { mail }).then((res) => res.data);
  return user;
};

export const postAuthLogin = async (username: string, password: string) => {
  const { accessToken, message, userId } = await api
    .post<ApiResultAccessToken>("/auth/login", { username, password })
    .then((res) => res.data);

  return {
    accessToken,
    message,
    userId,
  };
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

// 이거 어떻게 할지 고민해야함
export const postAuthVerifyLogin = async (username: string) => {
  const { accessToken, userId } = await api
    .post<ApiResultAccessToken>("/auth/verify/login", {
      username,
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
