export type ToastVariant = "success" | "error" | "info";

export interface ToastPayload {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface Toast extends ToastPayload {
  id: string;
  variant: ToastVariant;
}

type ToastListener = (toast: Toast) => void;

const listeners = new Set<ToastListener>();

export const onToast = (listener: ToastListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const createId = () =>
  `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const showToast = ({
  title,
  description,
  variant = "info",
  duration = 5000,
}: ToastPayload) => {
  const toast: Toast = {
    id: createId(),
    title,
    description,
    variant,
    duration,
  };

  listeners.forEach((listener) => listener(toast));

  return toast.id;
};

export const showErrorToast = (payload: {
  title: string;
  description?: string;
  duration?: number;
}) => showToast({ ...payload, variant: "error" });
