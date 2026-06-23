const ITEMS = [
  "Свободный график",
  "Доставки рядом с домом",
  "Пешком, вело, самокат, авто",
  "Поддержка на всех этапах",
  "Бонусы партнёров",
  "Быстрые выплаты",
]

export function Ticker() {
  return (
    <section aria-label="Преимущества" className="border-y border-secondary/20 bg-secondary py-4 text-secondary-foreground">
      <div className="relative flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-6 whitespace-nowrap px-6 text-sm font-semibold sm:text-base">
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
