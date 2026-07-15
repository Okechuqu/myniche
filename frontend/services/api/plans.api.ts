import api from "./client";

export const getPlans = async () => {
  const response = await api.get("/accounts/plans/");
  return response.data;
};

export default getPlans;
