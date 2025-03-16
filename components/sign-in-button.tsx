"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUsernameFromName } from "@/lib/auth"

export function SignInButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button disabled>Loading...</Button>
  }

  if (status === "authenticated" && session) {
    return (
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost">
          <Link href={`/profile/${getUsernameFromName(session.user?.name)}`}>Profile</Link>
        </Button>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    )
  }

  return <Button onClick={() => signIn("google")}>Sign In</Button>
}

