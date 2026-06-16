import api from "./client";
import type { AuthUser } from "@/store/auth.store";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface MeResponse extends AuthUser {}

export const login = async (payload: LoginPayload) => {
  const response = await api.post<AuthResponse>("/accounts/login/", payload);
  return response.data;
};

export const register = async (payload: RegisterPayload) => {
  const response = await api.post("/accounts/register/", payload);
  return response.data;
};

export const me = async () => {
  const response = await api.get<MeResponse>("/accounts/me/");
  return response.data;
};

export const googleLogin = async (payload: { token: string }) => {
  const response = await api.post<AuthResponse>(
    "/accounts/social/google/",
    payload,
  );
  return response.data;
};

export const facebookLogin = async (payload: { token: string }) => {
  const response = await api.post<AuthResponse>(
    "/accounts/social/facebook/",
    payload,
  );
  return response.data;
};
