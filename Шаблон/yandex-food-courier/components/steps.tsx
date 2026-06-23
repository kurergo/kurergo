import { ArrowRight } from "lucide-react"
import { REG_URL } from "@/lib/constants"

const steps = [
  { n: "1", title: "Заполните анкету", text: "Укажите контакты и город, чтобы перейти к подключению." },
  { n: "2", title: "Пройдите инструкции", text: "Разберитесь с приложением, слотами и правилами доставки." },
  { n: "3", title: "Выберите район", text: "Начните там, где хорошо знаете улицы, дома и точки выдачи." },
  { n: "4", title: "Выйдите на слот", text: "Берите первые заказы и находите свой рабочий ритм." },
]

export function Steps() {
  return (
    <section id="steps" className="bg-secondary py-16 text-secondary-foreground lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Как начать</p>
          <h2 className="mt-3 text-pretty font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            4 простых шага до первой доставки
          </h2>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-3xl border border-secondary-foreground/10 bg-secondary-foreground/[0.04] p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-heading text-lg font-extrabold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mt-5 font-heading text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/70">{s.text}</p>
            </li>
          ))}
        </ol>

        <a
          href={REG_URL}
          target="_blank"
          rel="noopener nofollow sponsored"
          className="group mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Начать регистрацию
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
