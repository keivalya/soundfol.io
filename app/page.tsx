import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Showcase your music portfolio with Soundfolio</h1>
        <p className="text-xl text-gray-600">
          Create a beautiful portfolio to showcase your music, performances, and projects. Connect with other musicians
          and find new opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/profile/example">See Example</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

