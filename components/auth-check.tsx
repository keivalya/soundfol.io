"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="container py-12 text-center">Loading...</div>
  }

  if (status === "authenticated") {
    return <>{children}</>
  }

  return <div className="container py-12 text-center">Redirecting...</div>
}

