"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user type
export type User = {
  id: string
  email: string
  name?: string
  username?: string
  profileImage?: string
  location?: string
  bio?: string
}

// Define auth context type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (userData: Partial<User>) => Promise<void>
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
type AuthProviderProps = {
  children: ReactNode
}

// Create auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem("soundfolio_user")

        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would validate credentials with a backend
      // For demo purposes, we'll just check if the email contains "test"
      if (!email.includes("test")) {
        throw new Error("Invalid credentials. Try an email containing 'test'")
      }

      // Create mock user data
      const userData: User = {
        id: "user_" + Date.now().toString(),
        email,
        name: "Adam Levis",
        username: "@adamlevis",
        profileImage: "/placeholder.svg?height=144&width=144",
        location: "Boston, MA",
        bio: "Music Producer | Singer | Audio Programmer | Video | Game Sound Design",
      }

      // Save user data to localStorage
      localStorage.setItem("soundfolio_user", JSON.stringify(userData))

      // Update state
      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Signup function
  const signup = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create mock user data
      const userData: User = {
        id: "user_" + Date.now().toString(),
        email,
        name: "New User",
        username: "@newuser",
        profileImage: "/placeholder.svg?height=144&width=144",
        location: "Your Location",
        bio: "Your Bio",
      }

      // Save user data to localStorage
      localStorage.setItem("soundfolio_user", JSON.stringify(userData))

      // Update state
      setUser(userData)
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)

    try {
      // Remove user data from localStorage
      localStorage.removeItem("soundfolio_user")

      // Update state
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update user profile function
  const updateUserProfile = async (userData: Partial<User>) => {
    setIsLoading(true)

    try {
      // Get current user data
      const currentUserData = localStorage.getItem("soundfolio_user")

      if (!currentUserData) {
        throw new Error("User not authenticated")
      }

      // Update user data
      const updatedUserData = {
        ...JSON.parse(currentUserData),
        ...userData,
      }

      // Save updated user data to localStorage
      localStorage.setItem("soundfolio_user", JSON.stringify(updatedUserData))

      // Update state
      setUser(updatedUserData)

      return updatedUserData
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Create context value
  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

