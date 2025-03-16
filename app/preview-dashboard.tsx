"use client"

import { Button } from "@/components/ui/button"

export default function PreviewDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold">soundfol.io</div>

          <div className="flex items-center gap-3">
            <Button variant="ghost">Profile</Button>
            <Button variant="outline">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow bg-gray-50">
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Welcome, John Doe</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Soundfolio</h2>
              <p className="mb-4">
                Your profile is ready to be customized. Add your music, videos, and projects to showcase your work.
              </p>
              <Button>View Your Profile</Button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">Edit Profile</Button>
                <Button variant="outline">Manage Embeds</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

