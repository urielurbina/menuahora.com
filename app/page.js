import { Suspense } from 'react'
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import Pricing from "@/components/Pricing";
import Questions from "@/components/Questions";
import BigCTA from "@/components/BigCTA";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SocialProof from "@/components/SocialProof";
import WithWithout from '@/components/WithWithout';
import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';

export default function Home() {
  return (
    <>
      {/* <Suspense>
        <Header />
      </Suspense> */}
      <main>
        <HeroSection/>
        <SocialProof/>
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <hr className="my-12 border-t border-gray-200" />
        </div> */}
        <WithWithout />
        <Benefits />
        <HowItWorks />
        <section id="pricing">
          <Pricing />
        </section>
        <Questions />
        <BigCTA />
      </main>
      <Footer />
    </>
  );
}
