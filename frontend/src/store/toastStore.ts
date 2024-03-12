import { create } from "zustand";

export type ToastType = "info" | "error";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastStoreState {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
}

const useToastStore = create<ToastStoreState>((set) => ({
  toasts: [],
  addToast: (message, type = "info") => {
    set((state) => ({
      toasts: [...state.toasts, { message, type, id: Date.now() }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

export default useToastStore;
