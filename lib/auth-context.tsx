"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { getCurrentUser, authenticateUser, logoutUser, initializeStorage, registerUser } from "@/lib/storage"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<User | null>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => null,
  logout: () => {},
  register: async () => null,
  isAuthenticated: false,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize storage with default data
    initializeStorage()

    // Check if user is already logged in
    const loadUser = () => {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      const user = authenticateUser(email, password)
      setUser(user)
      return user
    } catch (error) {
      console.error("Login error:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      const newUser = registerUser({ name, email, password });
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  const logout = () => {
    logoutUser()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
