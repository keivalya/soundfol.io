"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function SignIn() {
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Soundfolio</CardTitle>
          <CardDescription>Sign in to create and manage your music portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full"
              // Update the signIn call to remove the callbackUrl which might be causing issues
              onClick={() => signIn("google")}
            >
              <Image src="/placeholder.svg?height=20&width=20" alt="Google logo" width={20} height={20} />
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

