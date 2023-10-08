import { ApiResultAccessToken, ApiResultMessage } from "@/types";
import { api } from ".";

export const postUserExist = async (mail: string) => {
  const user = await api.post("/user/exist", { mail }).then((res) => res.data);
  return user;
};

export const postAuthLogin = async (mail: string, password: string) => {
  const { accessToken, message, userId } = await api
    .post<ApiResultAccessToken>("/auth/login", { mail, password })
    .then((res) => res.data);

  return {
    accessToken,
    message,
    userId,
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

export const postAuthVerifyLogin = async (userMail: string) => {
  const { accessToken } = await api
    .post<ApiResultAccessToken>("/auth/verify/login", {
      userMail,
    })
    .then((res) => res.data);

  return {
    accessToken,
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
