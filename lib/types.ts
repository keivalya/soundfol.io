export interface UserProfile {
  id?: string
  userId?: string
  name: string
  username: string
  bio: string
  location?: string
  avatar?: string
  about?: string
  socialLinks?: {
    instagram?: string
    youtube?: string
    email?: string
    [key: string]: string | undefined
  }
  embeds?: EmbedItem[]
}

export interface EmbedItem {
  id: string
  userId: string
  type: "music" | "demo" | "press" | "project"
  title: string
  description?: string
  embedCode?: string
  imageUrl?: string
  link?: string
  createdAt: string
  updatedAt: string
}

