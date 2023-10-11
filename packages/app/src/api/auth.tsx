import { ApiResultAccessToken, ApiResultMessage } from "@/types";
import { api } from ".";

export const postUserExist = async (mail: string) => {
  const user = await api.post("/user/exist", { mail }).then((res) => res.data);
  return user;
};

export const postAuthLogin = async (mail: string, password: string) => {
  const username = mail;
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

export const postAuthMail = async (userMail: string) => {
  await api.post("/auth/mail", { userMail });
};

export const postAuthVerify = async (userMail: string, verifyCode: string) => {
  const { message } = await api
    .post<ApiResultMessage>("/auth/verify", {
      userMail,
      verifyCode,
    })
    .then((res) => res.data);

  return { message };
};

// 이거 어떻게 할지 고민해야함
export const postAuthVerifyLogin = async (userMail: string) => {
  const { accessToken, userId } = await api
    .post<ApiResultAccessToken>("/auth/verify/login", {
      userMail,
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

export const putUpdatePassword = async (userMail: string, password: string) => {
  const { message } = await api
    .put<ApiResultMessage>("/user", { userMail, newPassword: password })
    .then((res) => res.data);

  return {
    message,
  };
};
