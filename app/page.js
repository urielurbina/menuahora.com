import {
  Hero,
  Features,
  UseCases,
  Comparison,
  Testimonials,
  Pricing,
  FAQ,
  CTA,
  Footer,
} from '@/components/landing'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <UseCases />
        <Comparison />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
