"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addUserEmbed } from "@/lib/embeds"
import { getUsernameFromName } from "@/lib/auth"
import type { EmbedItem } from "@/lib/types"

export default function NewEmbedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams?.get("type") || "music"
  const [isClient, setIsClient] = useState(false)

  const [formData, setFormData] = useState<Partial<EmbedItem>>({
    type: initialType,
    title: "",
    description: "",
    embedCode: "",
    imageUrl: "",
    link: "",
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check authentication status on the client side
    if (isClient && status === "unauthenticated") {
      window.location.href = "/api/auth/signin"
    }
  }, [status, isClient])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status !== "authenticated") return

    const username = getUsernameFromName(session?.user?.name)
    if (!username) return

    setSaving(true)
    try {
      await addUserEmbed(username, formData as EmbedItem)
      router.push("/dashboard/embeds")
    } catch (error) {
      console.error("Failed to add embed:", error)
      alert("Failed to add embed. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || !isClient) {
    return <div className="container py-12 text-center">Loading...</div>
  }

  // If not authenticated and on client, redirect will happen via useEffect
  if (status === "unauthenticated") {
    return <div className="container py-12 text-center">Redirecting to login...</div>
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Embed</h1>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Embed Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Embed Type</Label>
                <Select defaultValue={formData.type} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select embed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="music">Music (Spotify, SoundCloud)</SelectItem>
                    <SelectItem value="demo">Video (YouTube, Vimeo)</SelectItem>
                    <SelectItem value="press">Press & Performances</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a title for this embed"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter a description (optional)"
                  rows={3}
                />
              </div>

              {(formData.type === "music" || formData.type === "demo" || formData.type === "press") && (
                <div className="space-y-2">
                  <Label htmlFor="embedCode">Embed Code</Label>
                  <Textarea
                    id="embedCode"
                    name="embedCode"
                    value={formData.embedCode}
                    onChange={handleChange}
                    placeholder="Paste the embed code from Spotify, YouTube, etc."
                    rows={6}
                    required={formData.type !== "project"}
                  />
                  <p className="text-sm text-gray-500">
                    Paste the full embed code from the service (e.g., Spotify, YouTube)
                  </p>
                </div>
              )}

              {formData.type === "project" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      required={formData.type === "project"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">Project Link (Optional)</Label>
                    <Input
                      id="link"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      placeholder="https://example.com/project"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/embeds")}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Embed"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

