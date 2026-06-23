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

export type MeResponse = AuthUser;

export interface PasswordChangePayload {
  current_password?: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordChangeResponse {
  detail: string;
  user: AuthUser;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetRequestResponse {
  detail: string;
  reset_url?: string;
}

export interface PasswordResetConfirmPayload {
  uid: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordResetConfirmResponse {
  detail: string;
}

export interface ProfileUpdatePayload {
  username: string;
  niche?: string;
  creator_goal?: string;
  avatar?: string;
}

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
  const response = await api.post<AuthResponse>("/accounts/social/google/", {
    id_token: payload.token,
  });
  return response.data;
};

export const facebookLogin = async (payload: { token: string }) => {
  const response = await api.post<AuthResponse>("/accounts/social/facebook/", {
    access_token: payload.token,
  });
  return response.data;
};

export const changePassword = async (payload: PasswordChangePayload) => {
  const response = await api.post<PasswordChangeResponse>(
    "/accounts/password/change/",
    payload,
  );
  return response.data;
};

export const requestPasswordReset = async (
  payload: PasswordResetRequestPayload,
) => {
  const response = await api.post<PasswordResetRequestResponse>(
    "/accounts/password/reset/",
    payload,
  );
  return response.data;
};

export const confirmPasswordReset = async (
  payload: PasswordResetConfirmPayload,
) => {
  const response = await api.post<PasswordResetConfirmResponse>(
    "/accounts/password/reset/confirm/",
    payload,
  );
  return response.data;
};

export const updateProfile = async (payload: ProfileUpdatePayload) => {
  const response = await api.patch<AuthUser>("/accounts/profile/", payload);
  return response.data;
};
