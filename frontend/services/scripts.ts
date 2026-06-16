import api from "./api";

export const generateScript = async (payload: {
  niche: string;
  platform: string;
  topic: string;
  tone: string;
}) => {
  const response = await api.post("/scripts/generate/", payload);

  return response.data;
};
