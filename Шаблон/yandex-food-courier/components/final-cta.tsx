import { ArrowRight } from "lucide-react"
import { REG_URL } from "@/lib/constants"

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-secondary/10 blur-2xl" aria-hidden="true" />
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">Готовы попробовать?</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance font-heading text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
          Оставьте заявку и выберите первый удобный слот
        </h2>
        <a
          href={REG_URL}
          target="_blank"
          rel="noopener nofollow sponsored"
          className="group mt-8 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-base font-semibold text-secondary-foreground transition-transform hover:scale-[1.03]"
        >
          Стать курьером
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
