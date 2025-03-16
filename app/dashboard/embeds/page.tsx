"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Music, Video, Newspaper, Image } from "lucide-react"
import Link from "next/link"
import { getUserEmbeds } from "@/lib/embeds"
import { getUsernameFromName } from "@/lib/auth"
import type { EmbedItem } from "@/lib/types"

export default function ManageEmbedsPage() {
  const { data: session, status } = useSession()

  const [embeds, setEmbeds] = useState<EmbedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check authentication status on the client side
    if (isClient && status === "unauthenticated") {
      window.location.href = "/api/auth/signin"
    }

    if (status === "authenticated") {
      const fetchEmbeds = async () => {
        try {
          const username = getUsernameFromName(session?.user?.name)
          if (username) {
            const data = await getUserEmbeds(username)
            setEmbeds(data || [])
          }
        } catch (error) {
          console.error("Failed to fetch embeds:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchEmbeds()
    }
  }, [session, status, isClient])

  if (status === "loading" || loading || !isClient) {
    return <div className="container py-12 text-center">Loading...</div>
  }

  // If not authenticated and on client, redirect will happen via useEffect
  if (status === "unauthenticated") {
    return <div className="container py-12 text-center">Redirecting to login...</div>
  }

  const musicEmbeds = embeds.filter((embed) => embed.type === "music")
  const videoEmbeds = embeds.filter((embed) => embed.type === "demo")
  const pressEmbeds = embeds.filter((embed) => embed.type === "press")
  const projectEmbeds = embeds.filter((embed) => embed.type === "project")

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Embeds</h1>
          <Button asChild>
            <Link href="/dashboard/embeds/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Embed
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="music">
          <TabsList className="mb-6">
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="press">Press</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="music">
            <Card>
              <CardHeader>
                <CardTitle>Music Embeds</CardTitle>
                <CardDescription>Manage your Spotify, SoundCloud, or other music embeds</CardDescription>
              </CardHeader>
              <CardContent>
                {musicEmbeds.length > 0 ? (
                  <div className="space-y-4">
                    {musicEmbeds.map((embed) => (
                      <div key={embed.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{embed.title}</h3>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/embeds/${embed.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: embed.embedCode }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Music className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No music embeds yet</h3>
                    <p className="text-gray-500 mb-4">Add Spotify, SoundCloud, or other music embeds to your profile</p>
                    <Button asChild>
                      <Link href="/dashboard/embeds/new?type=music">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Music Embed
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs remain the same */}
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Video Embeds</CardTitle>
                <CardDescription>Manage your YouTube, Vimeo, or other video embeds</CardDescription>
              </CardHeader>
              <CardContent>
                {videoEmbeds.length > 0 ? (
                  <div className="space-y-4">
                    {videoEmbeds.map((embed) => (
                      <div key={embed.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{embed.title}</h3>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/embeds/${embed.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: embed.embedCode }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No video embeds yet</h3>
                    <p className="text-gray-500 mb-4">Add YouTube, Vimeo, or other video embeds to your profile</p>
                    <Button asChild>
                      <Link href="/dashboard/embeds/new?type=demo">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Video Embed
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="press">
            <Card>
              <CardHeader>
                <CardTitle>Press & Performances</CardTitle>
                <CardDescription>Manage your press mentions and performances</CardDescription>
              </CardHeader>
              <CardContent>
                {pressEmbeds.length > 0 ? (
                  <div className="space-y-4">
                    {pressEmbeds.map((embed) => (
                      <div key={embed.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{embed.title}</h3>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/embeds/${embed.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: embed.embedCode }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Newspaper className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No press or performances yet</h3>
                    <p className="text-gray-500 mb-4">Add press mentions, articles, or performances to your profile</p>
                    <Button asChild>
                      <Link href="/dashboard/embeds/new?type=press">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Press Item
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your project showcases</CardDescription>
              </CardHeader>
              <CardContent>
                {projectEmbeds.length > 0 ? (
                  <div className="space-y-4">
                    {projectEmbeds.map((embed) => (
                      <div key={embed.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{embed.title}</h3>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/embeds/${embed.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                        <div className="aspect-square max-w-xs">
                          <img
                            src={embed.imageUrl || "/placeholder.svg?height=300&width=300"}
                            alt={embed.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-gray-500 mb-4">Add your music projects with images and descriptions</p>
                    <Button asChild>
                      <Link href="/dashboard/embeds/new?type=project">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

