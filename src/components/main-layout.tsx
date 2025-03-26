import type React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Database, Github, Settings } from "lucide-react"
import Link from "next/link"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 font-bold">
            <Database className="h-5 w-5 text-primary" />
            <span>Supabase Edge Functions</span>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://github.com/supabase/supabase" target="_blank">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">設定</span>
              </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
      <footer className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Supabase Edge Functions Toolbox
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-right">Powered by Next.js and shadcn/ui</p>
        </div>
      </footer>
    </div>
  )
}

