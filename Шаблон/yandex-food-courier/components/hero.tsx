import Image from "next/image"
import { ArrowRight, Calculator } from "lucide-react"
import { REG_URL } from "@/lib/constants"

const stats = [
  { value: "1 час", label: "онлайн-старт" },
  { value: "24/7", label: "выбор слотов" },
  { value: "5 форматов", label: "доставки" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-energy.png"
          alt="Курьер Яндекс Еды на жёлтом электросамокате едет по городской улице"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Readability overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10 md:to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 lg:pb-24 lg:pt-24">
        <div className="flex max-w-2xl flex-col items-start">
          <p className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm">
            Подработка или основной доход
          </p>
          <h1 className="mt-5 text-balance font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Станьте курьером Яндекс Еды и выходите на доставки, когда удобно
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Доставляйте заказы рядом с домом пешком, на велосипеде, самокате или автомобиле. Быстрый старт, свободные
            слоты и понятный маршрут к первой доставке.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={REG_URL}
              target="_blank"
              rel="noopener nofollow sponsored"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.03]"
            >
              Заполнить заявку
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#calculator"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Calculator className="h-5 w-5" aria-hidden="true" />
              Посчитать доход
            </a>
          </div>

          <dl className="mt-10 grid w-full max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-2xl font-extrabold tracking-tight">{stat.value}</dd>
                <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </dl>

          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground">
              ₽
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">Ежедневные выплаты</p>
              <p className="text-xs text-muted-foreground">Доход приходит без задержек</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
