import Image from "next/image"
import { Footprints, Bike, Car } from "lucide-react"

const formats = [
  {
    icon: Footprints,
    title: "Пешком",
    text: "Для плотных районов, метро, кампусов и центра. Спокойный старт без транспорта.",
    tag: "Минимум подготовки",
  },
  {
    icon: Bike,
    title: "Вело или самокат",
    text: "Больше мобильности и маршрутов. Можно использовать свой транспорт или аренду.",
    tag: "Быстрый темп",
    accent: true,
  },
  {
    icon: Car,
    title: "На авто",
    text: "Для тех, кто хочет доставлять на своём автомобиле и меньше зависеть от погоды.",
    tag: "Свой маршрут",
  },
]

export function Formats() {
  return (
    <section id="formats" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Форматы</p>
        <h2 className="mt-3 text-pretty font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Выберите свой способ доставки
        </h2>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {formats.map((f) => (
          <article
            key={f.title}
            className={`flex flex-col rounded-3xl border p-7 transition-all hover:-translate-y-1 hover:shadow-lg ${
              f.accent
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-card"
            }`}
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                f.accent ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"
              }`}
            >
              <f.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-6 font-heading text-xl font-bold">{f.title}</h3>
            <p className={`mt-2 leading-relaxed ${f.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {f.text}
            </p>
            <span
              className={`mt-6 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                f.accent ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
              }`}
            >
              {f.tag}
            </span>
          </article>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-border">
        <Image
          src="/images/courier-bike.png"
          alt="Курьер на велосипеде доставляет заказ по городу"
          width={1600}
          height={600}
          className="h-56 w-full object-cover sm:h-72 lg:h-80"
        />
      </div>
    </section>
  )
}
