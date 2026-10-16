
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  getCurrentUser,
  loginUser,
  registerUser,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from '../services/auth'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (data: LoginPayload) => Promise<void>
  register: (data: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
)

const TOKEN_KEY = 'kurio_auth_token'

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // RESTAURA A SESSÃO AO ATUALIZAR A PÁGINA
  useEffect(() => {
    let active = true

    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY)

      if (!token) {
        if (active) setIsLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser(token)

        if (active) {
          setUser(currentUser)
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void restoreSession()

    return () => {
      active = false
    }
  }, [])

  async function login(data: LoginPayload) {
    const response = await loginUser(data)

    localStorage.setItem(TOKEN_KEY, response.token)
    setUser(response.user)
  }

  async function register(data: RegisterPayload) {
    const response = await registerUser(data)

    localStorage.setItem(TOKEN_KEY, response.token)
    setUser(response.user)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth deve ser utilizado dentro de AuthProvider',
    )
  }

  return context
}
