"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function PreviewHome() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold">soundfol.io</div>

          <div className="hidden md:flex relative max-w-md w-full mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input className="pl-10 bg-gray-100 border-gray-200" placeholder="Search musicians, projects..." />
          </div>

          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <div className="font-medium">Explore</div>
              <div className="font-medium">Feed</div>
              <div className="font-medium">Jobs</div>
            </div>

            <Button>Sign In</Button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Showcase your music portfolio with Soundfolio
            </h1>
            <p className="text-xl text-gray-600">
              Create a beautiful portfolio to showcase your music, performances, and projects. Connect with other
              musicians and find new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                See Example
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

