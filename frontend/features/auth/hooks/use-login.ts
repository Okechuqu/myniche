"use client";

import { isAxiosError } from "axios";
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
  onError?: (error: unknown) => void;
  redirectOnSuccess?: boolean;
};

export const useRegister = ({
  onSuccess,
  onError,
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
    onError: (error: unknown) => {
      console.error("Register mutation error:", error);
      if (isAxiosError(error) && error.response?.data) {
        console.error("Register response body:", error.response.data);
      }
      onError?.(error);
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
  onError?: (error: unknown) => void;
};

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) => {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      return await login(payload);
    },
    onError,
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
