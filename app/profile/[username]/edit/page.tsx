"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getUserProfile, updateUserProfile } from "@/lib/profile"
import { getUsernameFromName } from "@/lib/auth"
import type { UserProfile } from "@/lib/types"

export default function EditProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { data: session, status } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: "",
    username: "",
    bio: "",
    location: "",
    about: "",
    socialLinks: {
      instagram: "",
      youtube: "",
      email: "",
    },
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if the current user is the profile owner
  const currentUsername = getUsernameFromName(session?.user?.name)
  const isOwner = currentUsername === username

  useEffect(() => {
    setIsClient(true)

    if (isClient && status === "unauthenticated") {
      window.location.href = "/api/auth/signin"
      return
    }

    if (status === "authenticated") {
      if (!isOwner) {
        router.push(`/profile/${username}`)
        return
      }

      const fetchProfile = async () => {
        try {
          const data = await getUserProfile(username as string)
          if (data) {
            setFormData({
              name: data.name || session?.user?.name || "",
              username: data.username || (username as string),
              bio: data.bio || "",
              location: data.location || "",
              about: data.about || "",
              socialLinks: {
                instagram: data.socialLinks?.instagram || "",
                youtube: data.socialLinks?.youtube || "",
                email: data.socialLinks?.email || "",
              },
            })
          } else {
            // Initialize with session data if no profile exists
            setFormData({
              name: session?.user?.name || "",
              username: username as string,
              bio: "",
              location: "",
              about: "",
              socialLinks: {
                instagram: "",
                youtube: "",
                email: "",
              },
            })
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchProfile()
    }
  }, [username, session, status, isOwner, router, isClient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("socialLinks.")) {
      const socialKey = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isOwner) return

    setSaving(true)
    try {
      await updateUserProfile(username as string, formData)
      router.push(`/profile/${username}`)
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading || !isClient) {
    return <div className="container py-12 text-center">Loading...</div>
  }

  // If not authenticated and on client, redirect will happen via useEffect
  if (status === "unauthenticated") {
    return <div className="container py-12 text-center">Redirecting to login...</div>
  }

  if (!isOwner) {
    return null // Redirect handled in useEffect
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled
                />
                <p className="text-sm text-gray-500">Username cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Title/Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Music Producer | Singer | Audio Programmer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="about">About You</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Tell others about yourself, your music, and your experience..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="socialLinks.instagram"
                  value={formData.socialLinks?.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  name="socialLinks.youtube"
                  value={formData.socialLinks?.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/c/yourchannel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="socialLinks.email"
                  value={formData.socialLinks?.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  type="email"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push(`/profile/${username}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

