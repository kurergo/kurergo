import { Rocket, Bike, LineChart } from "lucide-react"

const benefits = [
  {
    icon: Rocket,
    num: "01",
    title: "Начните без опыта",
    text: "Инструкции проходят онлайн, а первые доставки можно выполнять в знакомом районе.",
  },
  {
    icon: Bike,
    num: "02",
    title: "Выбирайте формат",
    text: "Пешком, велосипед, самокат, Яндекс Байк или автомобиль — начните с того, что уже есть.",
  },
  {
    icon: LineChart,
    num: "03",
    title: "Держите доход под контролем",
    text: "Смотрите, какие слоты удобнее, когда спрос выше и какой район подходит именно вам.",
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Почему это удобно</p>
        <h2 className="mt-3 text-pretty font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Работа, которую можно встроить в свою неделю
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Выбирайте слот, район и транспорт под свой ритм. Главное — насколько быстро можно начать и получится ли
          управлять своим временем.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {benefits.map((b) => (
          <article
            key={b.num}
            className="group flex flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <b.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="font-heading text-2xl font-extrabold text-muted-foreground/40">{b.num}</span>
            </div>
            <h3 className="mt-6 font-heading text-xl font-bold">{b.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{b.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
