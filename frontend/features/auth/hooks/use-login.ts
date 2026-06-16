"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  login,
  register,
  type RegisterPayload,
  type AuthResponse,
} from "@/services/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

type UseRegisterOptions = {
  onSuccess?: (data: AuthResponse) => void;
  redirectOnSuccess?: boolean;
};

export const useRegister = ({
  onSuccess,
  redirectOnSuccess = true,
}: UseRegisterOptions = {}) => {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await register(payload);
      return login({
        email: payload.email,
        password: payload.password,
      });
    },
    onError: (error: any) => {
      // Log full error for easier debugging in browser console
      // React Query will surface this as the `error` value to the caller
      // eslint-disable-next-line no-console
      console.error("Register mutation error:", error);
      if (error?.response?.data) {
        console.error("Register response body:", error.response.data);
      }
    },
    onSuccess: (data: AuthResponse) => {
      setSession({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
      });

      if (onSuccess) {
        onSuccess(data);
      }

      if (redirectOnSuccess) {
        router.replace("/onboarding");
      }
    },
  });
};

export type LoginPayload = {
  email: string;
  password: string;
};

type UseLoginOptions = {
  onSuccess?: (data: AuthResponse) => void;
};

export const useLogin = ({ onSuccess }: UseLoginOptions = {}) => {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      return await login(payload);
    },
    onSuccess: (data: AuthResponse) => {
      setSession({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
      });

      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
};
