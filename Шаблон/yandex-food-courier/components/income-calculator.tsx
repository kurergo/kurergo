"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { REG_URL } from "@/lib/constants"

function ruble(value: number) {
  return value.toLocaleString("ru-RU") + " ₽"
}

type SliderProps = {
  label: string
  min: number
  max: number
  step?: number
  value: number
  display: string
  onChange: (v: number) => void
}

function Slider({ label, min, max, step = 1, value, display, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <output className="font-heading text-lg font-bold tabular-nums">{display}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-secondary [&::-moz-range-thumb]:bg-primary"
        style={{
          background: `linear-gradient(to right, var(--primary) ${pct}%, var(--muted) ${pct}%)`,
        }}
      />
    </label>
  )
}

export function IncomeCalculator() {
  const [hours, setHours] = useState(5)
  const [days, setDays] = useState(4)
  const [rate, setRate] = useState(450)

  const weekly = hours * days * rate

  return (
    <section id="calculator" className="bg-muted/60 py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Калькулятор</p>
          <h2 className="mt-3 text-pretty font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Прикиньте доход за неделю
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Это ориентировочный расчёт для планирования. Фактический доход зависит от города, спроса, длительности
            слотов, района, транспорта и условий сервиса.
          </p>
          <a
            href={REG_URL}
            target="_blank"
            rel="noopener nofollow sponsored"
            className="mt-6 inline-flex items-center gap-1.5 font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Перейти к регистрации
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-6">
            <Slider label="Часов в день" min={2} max={12} value={hours} display={String(hours)} onChange={setHours} />
            <Slider label="Дней в неделю" min={1} max={7} value={days} display={String(days)} onChange={setDays} />
            <Slider
              label="Ориентир в час"
              min={250}
              max={900}
              step={50}
              value={rate}
              display={ruble(rate)}
              onChange={setRate}
            />
          </div>

          <div className="mt-8 flex items-center justify-between rounded-2xl bg-secondary px-6 py-5 text-secondary-foreground">
            <span className="text-sm font-medium text-secondary-foreground/80">Ориентир за неделю</span>
            <strong className="font-heading text-3xl font-extrabold tabular-nums text-primary">{ruble(weekly)}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
