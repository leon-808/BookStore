import { SignupProps } from "../pages/Signup";
import { httpClient } from "./http";

export const signup = async (data: SignupProps) => {
  return await httpClient.post("/users", data);
};

export const resetRequest = async (email: SignupProps) => {
  return await httpClient.patch("/users/reset", email);
};

export const verifyResetToken = async (token: string) => {
  return await httpClient.post("/users/reset", { token: token });
};

export const resetPassword = async (password: SignupProps) => {
  return await httpClient.put("/users/reset", password);
};

interface LoginResponse {
  token: string;
}

export const login = async (data: SignupProps) => {
  return await httpClient.post<LoginResponse>("/users/login", data);
};
