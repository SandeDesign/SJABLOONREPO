// ============================================================
// DIT IS HET ENIGE BESTAND DAT JE PER KLANT AANPAST
// ============================================================

export type PresetName = 'editorial' | 'brutalist' | 'soft' | 'corporate' | 'artisan' | 'playful'

export const tenantConfig = {
  // Bedrijfsinfo
  info: {
    naam: 'Bedrijfsnaam',
    slogan: 'Jouw slogan hier',
    kvk: '',
    email: 'info@bedrijf.nl',
    telefoon: '',
    adres: '',
    domein: '',
  },

  // Branding
  branding: {
    primaryColor: '#2563eb',
    accentColor: '#f59e0b',
    preset: 'corporate' as PresetName,
    logoUrl: '/logo.svg',
    darkMode: false,
  },

  // Welke secties op de publieke website tonen
  website: {
    hero: true,
    about: true,
    services: true,
    portfolio: false,
    reviews: true,
    contact: true,
  },

  // Welke modules actief zijn in het CMS portaal
  modules: {
    afspraken: false,
    aanvragen: true,
    portfolio: false,
    producten: false,
    documenten: false,
    reviews: false,
  },

  // SEO
  seo: {
    title: 'Bedrijfsnaam',
    description: '',
    keywords: [] as string[],
    localBusiness: {
      type: 'LocalBusiness',
      openingHours: [] as string[],
    },
  },
}

export type TenantConfig = typeof tenantConfig
