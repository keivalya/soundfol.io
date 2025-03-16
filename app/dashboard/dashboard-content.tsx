"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUsernameFromName } from "@/lib/auth"

export default function DashboardContent() {
  const { data: session } = useSession()
  const username = getUsernameFromName(session?.user?.name)

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.name}</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Soundfolio</h2>
          <p className="mb-4">
            Your profile is ready to be customized. Add your music, videos, and projects to showcase your work.
          </p>
          <Button asChild>
            <Link href={`/profile/${username}`}>View Your Profile</Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="outline">
              <Link href={`/profile/${username}/edit`}>Edit Profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/embeds">Manage Embeds</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

