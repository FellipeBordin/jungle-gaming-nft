import { createContext } from "react";

import type { AuthUser, LoginPayload, RegisterPayload } from "../services/auth";

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
