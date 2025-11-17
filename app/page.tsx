import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { RolesSection } from "@/components/landing/roles-section"
import { CTASection } from "@/components/landing/cta-section"
import { ContactSection } from "@/components/landing/contact-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <RolesSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
