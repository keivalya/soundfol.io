import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SignInButton } from "./sign-in-button"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          soundfol.io
        </Link>

        <div className="hidden md:flex relative max-w-md w-full mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input className="pl-10 bg-gray-100 border-gray-200" placeholder="Search musicians, projects..." />
        </div>

        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="font-medium">
              Explore
            </Link>
            <Link href="/feed" className="font-medium">
              Feed
            </Link>
            <Link href="/jobs" className="font-medium">
              Jobs
            </Link>
          </div>

          <SignInButton />
        </nav>
      </div>
    </header>
  )
}

