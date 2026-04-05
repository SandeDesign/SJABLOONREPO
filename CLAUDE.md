# CLAUDE.md — SandeDesign Client Template

Dit bestand is de primaire context voor Claude Code in dit project.

---

## 1. Project Overview

| | |
|---|---|
| **Naam** | SandeDesign Client Template |
| **Onderdeel van** | SandeDesign ecosysteem |
| **Doel** | Universeel klant-website-template: publieke site + CMS portaal + Admin portaal |
| **Status** | In ontwikkeling |
| **Repo** | `https://github.com/SandeDesign/athleticacademy` |

---

## 2. Tech Stack

### Frontend

| | |
|---|---|
| **Framework** | React 18.2.0 (Vite, geen Next.js) |
| **Taal** | TypeScript 5.2.2 — strict mode actief |
| **Routing** | React Router DOM 6.20.1 |
| **Styling** | Tailwind CSS 3.3.6 — utility-first, dark mode via `class` strategie |
| **UI Library** | Eigen componenten (`Button`, `Card`, `Input`) + `lucide-react` iconen |
| **Animaties** | Framer Motion 10.16.16 |
| **Formulieren** | react-hook-form 7.48.2 + Zod 3.22.4 + @hookform/resolvers |
| **State** | Zustand (tenant config caching) |
| **Rich Text** | Tiptap (@tiptap/react + @tiptap/starter-kit) |
| **Notificaties** | react-hot-toast |
| **Build tool** | Vite 5.0.8 |
| **PWA** | Ja — `manifest.json` aanwezig, standalone display mode |

### Backend / Serverless

| | |
|---|---|
| **Database** | Firebase Cloud Firestore (real-time via `onSnapshot`) |
| **Authenticatie** | Firebase Authentication (email/password, browserLocalPersistence) |
| **Storage** | Firebase Cloud Storage |

### Hosting

| | |
|---|---|
| **Frontend** | Vercel |
| **Firebase Project** | Per klant eigen project |

---

## 3. Projectstructuur

```
athleticacademy/
├── src/
│   ├── App.tsx                     # Router: publiek + CMS + admin routes
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Tailwind + CSS custom properties (theming + presets)
│   ├── vite-env.d.ts               # Vite environment types
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx          # Button (variants, sizes, loading)
│   │   │   ├── Card.tsx            # Card + subcomponents
│   │   │   ├── Input.tsx           # Form input
│   │   │   ├── RichTextEditor.tsx  # Tiptap wrapper
│   │   │   ├── ImageUpload.tsx     # Firebase Storage upload
│   │   │   └── ModuleCard.tsx      # CMS dashboard module card
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx  # Route guard met role prop
│   │   └── layout/                 # (leeg na refactor)
│   ├── pages/
│   │   ├── public/
│   │   │   ├── PubliekeWebsite.tsx  # Root publieke pagina
│   │   │   ├── components/
│   │   │   │   ├── PubliekeNavbar.tsx
│   │   │   │   └── PubliekeFooter.tsx
│   │   │   └── sections/
│   │   │       ├── HeroSection.tsx
│   │   │       ├── AboutSection.tsx
│   │   │       ├── ServicesSection.tsx
│   │   │       ├── PortfolioSection.tsx
│   │   │       ├── ReviewsSection.tsx
│   │   │       └── ContactSection.tsx
│   │   ├── cms/
│   │   │   ├── CmsLayout.tsx       # Sidebar + outlet layout
│   │   │   ├── CmsDashboard.tsx    # Welkomst + module cards
│   │   │   ├── CmsPaginas.tsx      # Content editor
│   │   │   ├── CmsInstellingen.tsx # Account instellingen
│   │   │   └── modules/
│   │   │       ├── CmsAfspraken.tsx
│   │   │       ├── CmsAanvragen.tsx
│   │   │       ├── CmsPortfolio.tsx
│   │   │       ├── CmsProducten.tsx
│   │   │       ├── CmsDocumenten.tsx
│   │   │       └── CmsReviews.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminInstellingen.tsx  # Module/sectie/branding toggles
│   │   │   └── AdminGebruikers.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Auth (klant/admin rollen)
│   │   └── ThemeContext.tsx        # Light/dark/system theme
│   ├── hooks/
│   │   ├── useTenantConfig.ts     # Tenant config + Firestore merge + Zustand
│   │   └── useContent.ts          # Firestore content loader
│   ├── lib/
│   │   ├── firebase.ts            # Firebase init (env vars)
│   │   ├── firestore.ts           # Typed CRUD helpers
│   │   └── utils.ts               # cn() helper
│   └── config/
│       └── tenant.config.ts       # ENIGE KLANT-SPECIFIEKE BESTAND
├── public/
│   ├── manifest.json
│   ├── robots.txt
│   └── llms.txt
├── firestore.rules
├── .env.example
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 4. Functionele Beschrijving

### Drie lagen

1. **Publieke website** (`/`) — SEO-geoptimaliseerd, secties configureerbaar via tenant.config
2. **CMS portaal** (`/cms/*`) — Klant + admin kunnen content, modules en instellingen beheren
3. **Admin portaal** (`/admin/*`) — Alleen admin: modules aan/uit, branding, gebruikersbeheer

### Modules (aan/uit per klant)
- **Afspraken** — Planning en afspraakbeheer
- **Aanvragen** — Contactformulier verwerking
- **Portfolio** — Portfolio items beheren
- **Producten** — Producten/diensten catalogus
- **Documenten** — Bestandsupload en -beheer
- **Reviews** — Klantbeoordelingen goedkeuren/afwijzen

### Rollen
- **klant** — Toegang tot CMS portaal
- **admin** — Toegang tot CMS + Admin portaal

### Tenant config
`src/config/tenant.config.ts` is het enige bestand dat per klant wordt aangepast. Admin kan runtime overrides opslaan in Firestore `config/tenant`.

---

## 5. Firestore Datamodel

```
users/{uid}
  ├── uid: string
  ├── email: string
  ├── naam: string
  ├── role: 'klant' | 'admin'
  └── createdAt: Timestamp

content/hero          — { titel, subtitel, ctaTekst, ctaLink, achtergrondUrl }
content/about         — { titel, tekst, afbeeldingUrl, kenmerken[] }
content/services      — { titel, items[{ titel, beschrijving, prijs?, icoon? }] }

aanvragen/{id}        — { naam, email, telefoon?, bericht, status, createdAt }
afspraken/{id}        — { naam, email, telefoon?, datum, tijd, dienst, status, notities? }
portfolio/{id}        — { titel, beschrijving, afbeeldingUrl, url?, volgorde }
producten/{id}        — { naam, beschrijving, prijs, afbeeldingUrl?, actief }
documenten/{id}       — { naam, bestandsnaam, url, categorie, createdAt }
reviews/{id}          — { naam, tekst, rating, rol?, goedgekeurd }

config/tenant         — Runtime overrides van tenant.config.ts
```

---

## 6. Coding Regels

### Verplicht
- TypeScript strict mode — **geen `any`**
- CSS via Tailwind utility classes — geen inline styles
- Formulieren via `react-hook-form` + `Zod`
- Iconen via `lucide-react`
- Animaties via `framer-motion`
- `cn()` utility voor conditionele classnames
- Firebase calls via `AuthContext` of `src/lib/firestore.ts`
- Alle UI-tekst in het Nederlands

### Verboden
- **Geen Next.js** — Vite + React Router
- **Geen nieuwe npm packages** zonder overleg
- **Geen `console.log`** in productiecode
- **Geen directe Firebase SDK calls** in componenten
- **Geen hardcoded credentials** — gebruik `.env`
- **Geen inline styles**
- **Geen class components**

### Naamgeving
| | Conventie |
|---|---|
| Componenten | PascalCase |
| Functies/variabelen | camelCase |
| Bestanden (components) | PascalCase |
| Bestanden (lib/config) | camelCase |
| Firestore collections | camelCase |

---

## 7. Environment Variables

```bash
# .env.local
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

*SandeDesign Client Template*
*Laatst bijgewerkt: 2026-04-05*
