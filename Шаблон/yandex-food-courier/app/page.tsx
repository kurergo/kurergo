import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Ticker } from "@/components/ticker"
import { Benefits } from "@/components/benefits"
import { IncomeCalculator } from "@/components/income-calculator"
import { Formats } from "@/components/formats"
import { Steps } from "@/components/steps"
import { Cities } from "@/components/cities"
import { FinalCta } from "@/components/final-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Ticker />
        <Benefits />
        <IncomeCalculator />
        <Formats />
        <Steps />
        <Cities />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
