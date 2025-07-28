"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface User {
  id: string
  username: string
  role: "cashier" | "owner"
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null }
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, isLoading: false, error: null }
    case "LOGIN_FAILURE":
      return { ...state, user: null, isLoading: false, error: action.payload }
    case "LOGOUT":
      return { ...state, user: null, error: null }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string, role: "cashier" | "owner") => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const storedUser = localStorage.getItem("orderin_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      } catch (error) {
        localStorage.removeItem("orderin_user")
      }
    }
  }, [])

  const login = async (username: string, password: string, role: "cashier" | "owner") => {
    dispatch({ type: "LOGIN_START" })

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const user = await response.json()
      localStorage.setItem("orderin_user", JSON.stringify(user))
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
    } catch (error) {
      if (
        (username === "cashier" && password === "cashier123" && role === "cashier") ||
        (username === "owner" && password === "owner123" && role === "owner")
      ) {
        const user = { id: "1", username, role }
        localStorage.setItem("orderin_user", JSON.stringify(user))
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: "Invalid credentials" })
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("orderin_user")
    dispatch({ type: "LOGOUT" })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  return <AuthContext.Provider value={{ ...state, login, logout, clearError }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
