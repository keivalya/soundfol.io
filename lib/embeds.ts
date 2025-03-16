"use server"

import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import type { EmbedItem } from "./types"

// In a real app, this would connect to a database
// For this MVP, we'll use cookies to store the data
export async function getUserEmbeds(username: string): Promise<EmbedItem[]> {
  const embedsData = cookies().get(`embeds_${username}`)?.value

  if (!embedsData) return []

  try {
    return JSON.parse(embedsData) as EmbedItem[]
  } catch (error) {
    console.error("Error parsing embeds data:", error)
    return []
  }
}

export async function addUserEmbed(username: string, data: Partial<EmbedItem>): Promise<EmbedItem> {
  const existingEmbeds = await getUserEmbeds(username)

  const newEmbed: EmbedItem = {
    id: uuidv4(),
    userId: username,
    type: data.type as "music" | "demo" | "press" | "project",
    title: data.title || "Untitled",
    description: data.description,
    embedCode: data.embedCode,
    imageUrl: data.imageUrl,
    link: data.link,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updatedEmbeds = [...existingEmbeds, newEmbed]

  // In a real app, this would save to a database
  cookies().set(`embeds_${username}`, JSON.stringify(updatedEmbeds), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })

  return newEmbed
}

export async function updateUserEmbed(
  username: string,
  embedId: string,
  data: Partial<EmbedItem>,
): Promise<EmbedItem | null> {
  const existingEmbeds = await getUserEmbeds(username)

  const embedIndex = existingEmbeds.findIndex((embed) => embed.id === embedId)

  if (embedIndex === -1) return null

  const updatedEmbed: EmbedItem = {
    ...existingEmbeds[embedIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  existingEmbeds[embedIndex] = updatedEmbed

  // In a real app, this would save to a database
  cookies().set(`embeds_${username}`, JSON.stringify(existingEmbeds), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })

  return updatedEmbed
}

export async function deleteUserEmbed(username: string, embedId: string): Promise<boolean> {
  const existingEmbeds = await getUserEmbeds(username)

  const updatedEmbeds = existingEmbeds.filter((embed) => embed.id !== embedId)

  if (updatedEmbeds.length === existingEmbeds.length) {
    return false // Nothing was deleted
  }

  // In a real app, this would save to a database
  cookies().set(`embeds_${username}`, JSON.stringify(updatedEmbeds), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })

  return true
}

