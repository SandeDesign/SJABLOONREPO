import { useEffect } from 'react'
import { useTenantConfig } from '../../hooks/useTenantConfig'
import PubliekeNavbar from './components/PubliekeNavbar'
import PubliekeFooter from './components/PubliekeFooter'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ServicesSection from './sections/ServicesSection'
import PortfolioSection from './sections/PortfolioSection'
import ReviewsSection from './sections/ReviewsSection'
import ContactSection from './sections/ContactSection'

const PubliekeWebsite = () => {
  const { config } = useTenantConfig()

  useEffect(() => {
    document.title = config.seo.title || config.info.naam
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && config.seo.description) {
      metaDesc.setAttribute('content', config.seo.description)
    }
  }, [config.seo.title, config.seo.description, config.info.naam])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900" data-preset={config.branding.preset}>
      <PubliekeNavbar />

      <main>
        {config.website.hero && <HeroSection />}
        {config.website.about && <AboutSection />}
        {config.website.services && <ServicesSection />}
        {config.website.portfolio && <PortfolioSection />}
        {config.website.reviews && <ReviewsSection />}
        {config.website.contact && <ContactSection />}
      </main>

      <PubliekeFooter />
    </div>
  )
}

export default PubliekeWebsite
