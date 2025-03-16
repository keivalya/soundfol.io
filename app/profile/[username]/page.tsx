"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Youtube, Mail, MapPin, Plus, Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getUserProfile } from "@/lib/profile"
import { getUsernameFromName } from "@/lib/auth"
import type { UserProfile } from "@/lib/types"

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  const currentUsername = getUsernameFromName(session?.user?.name)
  const isOwner = currentUsername === username

  useEffect(() => {
    setIsClient(true)

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(username as string)
        setProfile(data)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (loading || !isClient) {
    return <div className="container py-12 text-center">Loading profile...</div>
  }

  if (!profile && !loading) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <p className="mb-6">The profile you're looking for doesn't exist or hasn't been created yet.</p>
        {isOwner && (
          <Button asChild>
            <Link href={`/profile/${username}/edit`}>Create Your Profile</Link>
          </Button>
        )}
      </div>
    )
  }

  // Use default profile data if none exists
  const profileData = profile || {
    name: username,
    username: username,
    bio: "Music Producer | Singer | Audio Programmer",
    location: "Boston, MA",
    avatar: "/placeholder.svg?height=200&width=200",
    embeds: [],
    socialLinks: {
      instagram: "#",
      youtube: "#",
      email: "#",
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar - Profile info */}
        <div className="md:col-span-1 bg-blue-50 rounded-lg p-6 flex flex-col items-center text-center">
          <div className="mb-2 text-lg font-medium">@{profileData.username}</div>
          <div className="relative mb-4">
            <Image
              src={profileData.avatar || "/placeholder.svg"}
              alt={profileData.name}
              width={150}
              height={150}
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold mb-2">{profileData.name}</h1>
          <p className="text-sm text-gray-700 mb-4">{profileData.bio}</p>

          {profileData.location && (
            <div className="flex items-center justify-center text-sm text-gray-600 mb-6">
              <MapPin className="w-4 h-4 mr-1" />
              {profileData.location}
            </div>
          )}

          <Button className="w-full mb-6">Resonate</Button>

          <div className="flex justify-center gap-4 mb-4">
            {profileData.socialLinks?.instagram && (
              <Link href={profileData.socialLinks.instagram} className="text-gray-700 hover:text-gray-900">
                <Instagram className="w-6 h-6" />
              </Link>
            )}
            {profileData.socialLinks?.youtube && (
              <Link href={profileData.socialLinks.youtube} className="text-gray-700 hover:text-gray-900">
                <Youtube className="w-6 h-6" />
              </Link>
            )}
            {profileData.socialLinks?.email && (
              <Link href={`mailto:${profileData.socialLinks.email}`} className="text-gray-700 hover:text-gray-900">
                <Mail className="w-6 h-6" />
              </Link>
            )}
          </div>

          {isOwner && (
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href={`/profile/${username}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          )}
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          <Tabs defaultValue="portfolio">
            <TabsList className="mb-6">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="space-y-8">
              {/* Performances / Press Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Performances / Press</h2>
                  {isOwner && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/embeds/new?type=press">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Link>
                    </Button>
                  )}
                </div>
                <Card>
                  <CardContent className="p-6 min-h-[200px] flex items-center justify-center text-gray-500">
                    {profileData.embeds?.filter((e) => e.type === "press").length > 0 ? (
                      <div>Press content here</div>
                    ) : (
                      <div className="text-center">
                        <p>No performances or press added yet</p>
                        {isOwner && (
                          <Button asChild variant="link" size="sm" className="mt-2">
                            <Link href="/dashboard/embeds/new?type=press">Add your first item</Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Music Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Music</h2>
                  {isOwner && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/embeds/new?type=music">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Link>
                    </Button>
                  )}
                </div>
                <Card>
                  <CardContent className="p-6 min-h-[200px]">
                    {profileData.embeds?.filter((e) => e.type === "music").length > 0 ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-center">
                        <div>
                          <p>No music added yet</p>
                          {isOwner && (
                            <Button asChild variant="link" size="sm" className="mt-2">
                              <Link href="/dashboard/embeds/new?type=music">Add your first track</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Projects Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  {isOwner && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/embeds/new?type=project">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Link>
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.embeds?.filter((e) => e.type === "project").length > 0 ? (
                    <>
                      <div className="aspect-square bg-purple-100 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=400&width=400"
                          alt="Project 1"
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="aspect-square bg-red-100 rounded-lg overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=400&width=400"
                          alt="Project 2"
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 flex items-center justify-center h-40 bg-gray-100 rounded-lg text-gray-500 text-center">
                      <div>
                        <p>No projects added yet</p>
                        {isOwner && (
                          <Button asChild variant="link" size="sm" className="mt-2">
                            <Link href="/dashboard/embeds/new?type=project">Add your first project</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Demo Reel Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Demo Reel</h2>
                  {isOwner && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/embeds/new?type=demo">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Link>
                    </Button>
                  )}
                </div>
                <Card>
                  <CardContent className="p-6 min-h-[200px]">
                    {profileData.embeds?.filter((e) => e.type === "demo").length > 0 ? (
                      <div className="aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-center">
                        <div>
                          <p>No demo reel added yet</p>
                          {isOwner && (
                            <Button asChild variant="link" size="sm" className="mt-2">
                              <Link href="/dashboard/embeds/new?type=demo">Add your demo reel</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  {profileData.about ? (
                    <div className="prose max-w-none">
                      <p>{profileData.about}</p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <p>No about information added yet.</p>
                      {isOwner && (
                        <Button asChild variant="link" size="sm" className="mt-2 p-0">
                          <Link href={`/profile/${username}/edit`}>Add about information</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

