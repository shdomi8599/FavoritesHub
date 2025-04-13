import { api } from ".";

export const getAIRecommendation = async (accessToken: string) => {
  const recommendation = await api<string>(`/ai/recommendation`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);

  return recommendation;
};
