
import { api } from './api'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    '/auth/register',
    payload,
  )

  return response.data
}

export async function loginUser(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    '/auth/login',
    payload,
  )

  return response.data
}

export async function getCurrentUser(
  token: string,
): Promise<AuthUser> {
  const response = await api.get<{ user: AuthUser }>(
    '/auth/me',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data.user
}
