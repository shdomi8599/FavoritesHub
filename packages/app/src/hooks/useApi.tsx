import { accessTokenState } from "@/states";
import axios from "axios";
import { useRecoilValue } from "recoil";

export const useApi = () => {
  const accessToken = useRecoilValue(accessTokenState);
  const baseURL =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL
      : "http://localhost:8080/api";

  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return { api };
};
