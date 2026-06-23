import Link from "next/link"
import { Package } from "lucide-react"
import { NAV_LINKS, REG_URL } from "@/lib/constants"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Package className="h-5 w-5" aria-hidden="true" />
          </span>
          Курьерский старт
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={REG_URL}
          target="_blank"
          rel="noopener nofollow sponsored"
          className="inline-flex h-10 items-center justify-center rounded-full bg-secondary px-5 text-sm font-semibold text-secondary-foreground transition-transform hover:scale-[1.03]"
        >
          Стать курьером
        </a>
      </div>
    </header>
  )
}
