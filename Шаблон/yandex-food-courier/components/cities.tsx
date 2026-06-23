import { MapPin } from "lucide-react"
import { REG_URL } from "@/lib/constants"

const CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Екатеринбург",
  "Новосибирск",
  "Казань",
  "Нижний Новгород",
  "Краснодар",
  "Ростов-на-Дону",
  "Воронеж",
  "Самара",
  "Уфа",
  "Челябинск",
  "Владивосток",
  "Иркутск",
  "Сочи",
  "Калининград",
  "Тюмень",
  "Барнаул",
]

export function Cities() {
  return (
    <section id="cities" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="rounded-[2rem] border border-border bg-card p-8 sm:p-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Найдите свой город</p>
          <h2 className="mt-3 text-pretty font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Доставки доступны по всей России
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Подключение открыто в сотнях городов — от крупных мегаполисов до небольших населённых пунктов. Выберите свой
            и начните рядом с домом.
          </p>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2.5">
          {CITIES.map((city) => (
            <li key={city}>
              <a
                href={REG_URL}
                target="_blank"
                rel="noopener nofollow sponsored"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-accent"
              >
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                {city}
              </a>
            </li>
          ))}
          <li>
            <span className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              и ещё сотни городов
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}
