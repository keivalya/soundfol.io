import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export async function getSession() {
  try {
    return await getServerSession(authOptions)
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export function getUsernameFromName(name: string | null | undefined): string {
  if (!name) return "user"
  return name.replace(/\s+/g, "").toLowerCase()
}

