import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface StoreState {
  isLoggedIn: boolean;
  storeLogin: (token: string) => void;
  storeLogout: () => void;
}

export const decodeToken = (token: string): { id: number; exp: number } => {
  return jwtDecode(token);
};

const isTokenExpried = (token: string | null): boolean => {
  if (!token) return true;
  const { exp } = decodeToken(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
};

export const getToken = () => {
  let token = localStorage.getItem("token");
  if (isTokenExpried(token)) token = null;
  return token;
};

const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

const removeToken = () => {
  localStorage.removeItem("token");
};

export const useAuthStore = create<StoreState>((set) => ({
  isLoggedIn: !isTokenExpried(getToken()),
  storeLogin: (token: string) => {
    set({ isLoggedIn: true });
    setToken(token);
  },
  storeLogout: () => {
    set({ isLoggedIn: false });
    removeToken();
  },
}));
