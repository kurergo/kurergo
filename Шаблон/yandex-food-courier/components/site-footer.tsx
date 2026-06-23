import { Package } from "lucide-react"
import { NAV_LINKS } from "@/lib/constants"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr]">
        <div className="max-w-md">
          <div className="flex items-center gap-2 font-heading text-lg font-extrabold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Package className="h-5 w-5" aria-hidden="true" />
            </span>
            Курьерский старт
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Информационный сайт для подключения к доставке заказов. Условия и доход зависят от города, спроса, времени на
            линии и выбранного формата.
          </p>
        </div>

        <nav aria-label="Навигация в подвале" className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Разделы</p>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Курьерский старт. Не является публичной офертой.
        </div>
      </div>
    </footer>
  )
}
