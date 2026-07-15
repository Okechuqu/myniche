import api from "./client";

export const listScripts = async () => {
  const response = await api.get("/scripts/");
  return response.data as Array<{
    id: number;
    title: string;
    niche: string;
    platform: string;
    topic: string;
    content: string;
    created_at: string;
  }>;
};

export const deleteScript = async (scriptId: number) => {
  await api.delete(`/scripts/${scriptId}/`);
};
