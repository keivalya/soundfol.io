"use server"

import { cookies } from "next/headers"
import type { UserProfile } from "./types"

// In a real app, this would connect to a database
// For this MVP, we'll use cookies to store the data
export async function getUserProfile(username: string): Promise<UserProfile | null> {
  const profileData = cookies().get(`profile_${username}`)?.value

  if (!profileData) return null

  try {
    return JSON.parse(profileData) as UserProfile
  } catch (error) {
    console.error("Error parsing profile data:", error)
    return null
  }
}

export async function updateUserProfile(username: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const existingProfile = await getUserProfile(username)

  const updatedProfile: UserProfile = {
    ...(existingProfile as UserProfile),
    ...data,
    username, // Ensure username doesn't change
  }

  // In a real app, this would save to a database
  cookies().set(`profile_${username}`, JSON.stringify(updatedProfile), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })

  return updatedProfile
}

