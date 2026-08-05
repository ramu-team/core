"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { cn } from "@ramu/ui/lib/utils"
import { Button } from "@ramu/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ramu/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@ramu/ui/components/field"
import { Input } from "@ramu/ui/components/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const { error } = await authClient.signIn.email({ email, password })
          if (error) {
            reject(new Error(error.message || "Login gagal. Silakan coba lagi."))
          } else {
            resolve("Login sukses!")
            router.push("/dashboard")
          }
        } catch (err) {
          reject(new Error("Terjadi kesalahan jaringan."))
        } finally {
          setIsLoading(false)
        }
      }),
      {
        loading: "Mencoba masuk...",
        success: "Login berhasil! Mengalihkan...",
        error: (err) => err.message,
      }
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login to your Admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@ramu.id"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              

              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        Secure administration portal for Ramu Ecosystem
      </div>
    </div>
  )
}

