# CLAUDE.md — Athletic Academy

Dit bestand is de primaire context voor Claude Code in dit project. Gebaseerd op de werkelijke codebase zoals geanalyseerd op 2026-03-16.

---

## 1. Project Overview

| | |
|---|---|
| **Naam** | Athletic Academy (AAA) |
| **Onderdeel van** | SandeDesign ecosysteem |
| **Doel** | Een fitness & coaching platform waar studenten, coaches en admins trainingen, community en messaging beheren via een PWA-app |
| **Status** | In ontwikkeling |
| **URL** | `https://fl-group.org` (branding/CDN host) |
| **Repo** | `https://github.com/SandeDesign/athleticacademy` |
| **Firebase Project** | `athleticacademy-bb77a` |

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
| **Build tool** | Vite 5.0.8 |
| **PWA** | Ja — `manifest.json` aanwezig, standalone display mode |

### Backend / Serverless

| | |
|---|---|
| **Database** | Firebase Cloud Firestore (real-time via `onSnapshot`) |
| **Authenticatie** | Firebase Authentication (email/password, browserLocalPersistence) |
| **Storage** | Firebase Cloud Storage |
| **Make.com** | Geen huidige Make.com integraties gevonden |
| **PHP proxy** | Geen — volledig client-side via Firebase SDK |

### Hosting

| | |
|---|---|
| **Frontend** | Onbekend (Netlify/Vercel/eigen host — nog niet geconfigureerd) |
| **Externe CDN** | `fl-group.org` voor logo en PWA icons |

### Authenticatie

Firebase Auth — email/password, persistentie via `browserLocalPersistence`, rol-gebaseerde toegang (student / coach / admin).

---

## 3. Projectstructuur

```
athleticacademy/
├── src/
│   ├── App.tsx                     # Hoofd-router (public + protected routes)
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Tailwind imports + CSS custom properties (theming)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx          # Reusable button (variants, sizes, loading state)
│   │   │   ├── Card.tsx            # Card + CardHeader/Title/Description/Content/Footer
│   │   │   └── Input.tsx           # Form input met icon, label en error state
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx  # Route guard — redirect naar /login indien niet ingelogd
│   │   ├── layout/
│   │   │   └── PublicLayout.tsx    # Wrapper voor publieke pagina's
│   │   ├── dashboard/
│   │   │   ├── DashboardOverview.tsx       # Welkomstscherm + campus selectie
│   │   │   ├── CourseCard.tsx              # Cursuskaart component
│   │   │   ├── LearningCenterContent.tsx   # Leerinhoud weergave
│   │   │   ├── NotificationCenter.tsx      # Notificatiesysteem
│   │   │   └── UserSettings.tsx            # Gebruikersinstellingen
│   │   ├── chat/
│   │   │   ├── ConversationsOverview.tsx   # Gesprekkenlijst + DM overzicht
│   │   │   └── ConversationDetail.tsx      # Individueel chatgesprek
│   │   ├── community/
│   │   │   ├── ChatComponent.tsx           # Community groepschat
│   │   │   └── UsersList.tsx               # Gebruikersoverzicht met follow/unfollow
│   │   └── InstallPrompt.tsx               # PWA installatie-prompt
│   ├── pages/
│   │   ├── public/
│   │   │   └── HomePage.tsx        # Landingspagina (hero, CTA, animaties)
│   │   ├── Dashboard.tsx           # Hoofdlayout: sidebar + mobile tabs + nested routes
│   │   ├── Login.tsx               # Inlogformulier (Zod validatie)
│   │   ├── Register.tsx            # Registratieformulier (Zod validatie)
│   │   ├── Programs.tsx            # Trainingsrogramma catalogus (zoek + filter)
│   │   ├── CommunityPage.tsx       # Sociale feed + gebruikers
│   │   ├── ProfilePage.tsx         # Gebruikersprofiel
│   │   ├── FysiekCampusPage.tsx    # Campus fysieke training
│   │   └── MentaalCampusPage.tsx   # Campus mentale training
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Auth state, alle Firebase calls, user types
│   │   └── ThemeContext.tsx        # Light/dark/system theme management
│   ├── lib/
│   │   ├── firebase.ts             # Firebase initialisatie + service exports
│   │   └── utils.ts                # cn() helper (clsx + tailwind-merge)
│   └── config/
│       └── brand.ts                # Firebase credentials + brand config
├── public/
│   └── manifest.json               # PWA manifest
├── firestore.rules                 # Firestore security rules
├── index.html                      # HTML entry point (PWA meta tags)
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 4. Functionele Beschrijving

### Wat doet deze app?

Athletic Academy (AAA) is een fitness- en coachingplatform als Progressive Web App. Gebruikers kunnen zich registreren als student, coach of admin. Ze hebben toegang tot trainingsrogramma's, twee "campussen" (Fysiek en Mentaal), een community-feed met posts en volgers, real-time chat (groeps- en direct messages) en rolspecifieke beheerpanelen.

### Hoofdfunctionaliteiten

- **Authenticatie** — Registratie, inloggen, uitloggen via Firebase Auth (email/password), rol-toewijzing (student/coach/admin)
- **Dashboard & Campussen** — Twee campussen: Fysiek (kracht/conditie) en Mentaal (mindset/herstel), elk met eigen content
- **Trainingsrogramma's** — Catalogus met 6+ programma's, zoekfunctie, filters op categorie (Strength, Cardio, HIIT, Yoga, etc.) en niveau (Beginner, Intermediate, Advanced)
- **Community & Sociale Feed** — Status-updates plaatsen, reageren, liken, volgen/ontvolgen van andere gebruikers
- **Messaging** — Groepschat (community), directe messages (DM) en coach-aangemaakt groepsgesprekken
- **Rolbeheer** — Coach-exclusieve content management & studentoverzicht; admin-exclusief gebruikersbeheer & adminpaneel
- **PWA** — Installeerbaar op mobiel, standalone app-modus, Nederlandse taal

### Gebruikersflow

1. Gebruiker opent de app → ziet landingspagina met hero-sectie
2. Klikt op "Sign In" of "Download App" → navigeert naar `/login` of `/register`
3. Na inloggen → redirect naar `/dashboard` (DashboardOverview met campus-keuze)
4. Kiest campus (Fysiek of Mentaal) → ziet campusspecifieke content
5. Navigeert via sidebar (desktop) of bottom tab bar (mobiel) naar Programs, Community, Chat, Profile
6. Coach/admin ziet extra menu-items voor content management en gebruikersbeheer

### Wat doet de app NIET?

- Geen betaalintegratie of abonnementsbeheer
- Geen video-upload of video-streaming (routes bestaan als stubs, niet geïmplementeerd)
- Geen push-notificaties (PWA manifest aanwezig, service worker niet geïmplementeerd)
- Geen externe REST API's of Make.com webhooks (alles via Firebase)
- Geen PHP-backend of server-side rendering
- Progress tracking, schema's, doelen en trainersoverzicht zijn nog stubs

---

## 5. Visuele Beschrijving

### Kleurenschema

| Rol | Kleur | Hex |
|---|---|---|
| Primair (brand red) | Rood | `#ff5959` / `#ef4444` |
| Fysiek Campus | Oranje → Rood | `#f97316` → `#ef4444` |
| Mentaal Campus | Paars → Indigo | `#a855f7` → `#6366f1` |
| Achtergrond (light) | Wit | `#ffffff` |
| Achtergrond (dark) | Donker slate | `#0f172a` |
| Tekst (light) | Donkergrijs | `#1f2937` |
| Tekst (dark) | Witgrijs | `#f8fafc` |
| Border (light) | Lichtgrijs | `#e5e7eb` |
| Border (dark) | Mediumgrijs | `#334155` |
| Success | Groen | `#10b981` |
| Warning | Geel | `#fbbf24` |

### Typografie

- **Font:** Inter (Google Fonts)
- **Gewichten:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Design stijl

Dark/Light thema met automatische system-voorkeur detectie. Glassmorphism-achtige kaarten in dark mode, rode brand-accentkleur, gradient-achtergronden voor campus- en hero-secties. Moderne, sportieve uitstraling.

### Componenten aanwezig

- Sidebar navigatie (desktop) + hamburger menu
- Bottom tab bar (mobiel, 5 knoppen)
- Dashboard / overzichtspagina met campus-kaarten
- Formulieren (login, register — react-hook-form + Zod)
- Cursuskaarten met rating, moeilijkheidsgraad, badges
- Community feed met posts
- Chat interfaces (lijst + detail)
- Gebruikersprofielen met volgers/volgend
- PWA install prompt
- Notificatiecentrum
- Gebruikersinstellingen

### Responsive

Ja — mobile-first. Bottom tab bar op mobiel, sidebar op desktop. Campus-selectie is kaartgebaseerd grid.

---

## 6. Make.com Integraties

**Geen Make.com integraties aanwezig** in de huidige codebase. Alle backend-logica loopt via Firebase SDK direct vanuit de client.

---

## 7. PHP Proxy / Eigen Host

**Geen PHP proxy aanwezig.** Dit project is volledig client-side. Alle server-side operaties (auth, data, storage) worden afgehandeld door Firebase services.

---

## 8. Coding Regels voor dit Project

Claude Code houdt zich ALTIJD aan deze regels, ook als een andere aanpak "logischer" lijkt.

### Verplicht

- Gebruik altijd `fetch` of Firebase SDK — nooit `axios`
- Componenten zijn altijd functional components met hooks — geen class components
- TypeScript strict mode — **geen `any`**, altijd expliciete types
- CSS via Tailwind utility classes — geen inline styles, geen CSS-in-JS
- Formulieren via `react-hook-form` + `Zod` schema's
- Iconen via `lucide-react` — geen andere iconbibliotheek toevoegen
- Animaties via `framer-motion` — geen CSS animations tenzij al gedefinieerd in `tailwind.config.js`
- Theming via CSS custom properties (`--background`, `--foreground`, etc.) — zie `index.css`
- `cn()` utility gebruiken voor conditionele classnames (uit `src/lib/utils.ts`)
- Firebase calls altijd via `AuthContext` methodes — niet direct Firebase SDK aanroepen in componenten

### Verboden

- **Geen Next.js** — dit project gebruikt Vite + React Router, geen App Router, geen Pages Router
- **Geen nieuwe npm packages** toevoegen zonder overleg
- **Geen `console.log`** in productiecode
- **Geen directe Firebase SDK calls** in component-bestanden buiten `AuthContext.tsx` en `firebase.ts`
- **Geen hardcoded Firebase credentials** buiten `src/config/brand.ts`
- **Geen inline styles** (`style={{...}}`)
- **Geen class components**

### Naamgeving

| | Conventie |
|---|---|
| Componenten | PascalCase (`CourseCard.tsx`) |
| Functies/variabelen | camelCase (`getUserConversations`) |
| Bestanden (components) | PascalCase (`DashboardOverview.tsx`) |
| Bestanden (lib/config) | camelCase (`firebase.ts`, `brand.ts`) |
| CSS classes | Tailwind utility classes |
| Firestore collections | camelCase (`statusUpdates`, `chatMessages`) |

### Bestandslocaties

| Type | Map |
|---|---|
| Pagina-componenten | `src/pages/` |
| Herbruikbare UI | `src/components/ui/` |
| Feature-componenten | `src/components/[feature]/` |
| Context providers | `src/contexts/` |
| Utilities/helpers | `src/lib/` |
| Config/credentials | `src/config/` |

---

## 9. Environment Variables

**Let op:** Firebase credentials staan momenteel hardcoded in `src/config/brand.ts`. Dit is een security-issue dat verholpen moet worden.

### Gewenste .env structuur (nog aan te maken)

```bash
# .env.local
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

In Vite zijn environment variables bereikbaar via `import.meta.env.VITE_*`.

### Nooit committen

- Firebase API keys / credentials
- Enige secrets of tokens
- `.env.local` bestanden

---

## 10. Bekende Issues / TODO

- **Security:** Firebase credentials staan hardcoded in `src/config/brand.ts` — verplaatsen naar `.env.local` en `.gitignore` toevoegen
- **Stub routes:** `/dashboard/videos`, `/dashboard/schedules`, `/dashboard/progress`, `/dashboard/trainers`, `/dashboard/goals` zijn nog niet geïmplementeerd
- **Service worker:** PWA manifest aanwezig maar geen service worker (geen offline support, geen push notificaties)
- **Coach/admin routes:** `/dashboard/coach/*` en `/dashboard/admin/*` zijn rolbeveiligd via UI maar hebben geen volledige implementatie
- **Statische data:** Trainingsrogramma's in `Programs.tsx` zijn hardcoded — migratie naar Firestore gewenst
- **Geen .env.example:** Ontbreekt — aanmaken voor nieuwe ontwikkelaars
- **Geen CI/CD pipeline:** Nog niet geconfigureerd (geen `netlify.toml`, geen `vercel.json`, geen GitHub Actions)
- **Beeldoptimalisatie:** Externe Unsplash-afbeeldingen gebruikt voor cursussen — vervangen door eigen gehoste assets
- **Firestore regels:** `firestore.rules` aanwezig maar controleer of regels voldoende strict zijn voor productie

---

## 11. Firebase Datamodel

### Collections

```
users/{userId}
  ├── email: string
  ├── displayName: string
  ├── role: 'student' | 'coach' | 'admin'
  ├── followers: string[]        # array van userId's
  ├── following: string[]        # array van userId's
  └── statusUpdates: string[]    # array van update ID's

statusUpdates/{updateId}
  ├── userId: string
  ├── content: string
  └── timestamp: Timestamp

chatMessages/{messageId}        # Globale community chat
  ├── userId: string
  ├── userName: string
  ├── userRole: string
  ├── content: string
  └── timestamp: Timestamp

conversations/{conversationId}
  ├── type: 'dm' | 'group'
  ├── participants: string[]
  ├── name?: string              # alleen bij group
  ├── adminId?: string           # alleen bij group
  └── createdAt: Timestamp
  └── messages/{messageId}       # sub-collection
        ├── userId: string
        ├── userName: string
        ├── userRole: string
        ├── content: string
        └── timestamp: Timestamp
```

---

## 12. SandeDesign Ecosysteem Context

Dit project is onderdeel van een breder ecosysteem van SandeDesign applicaties.

### Gerelateerde projecten

| Project | Doel | Relatie |
|---|---|---|
| **Facto** | Facturatie voor freelancers | Geen directe relatie — apart Firebase project |
| **Bindra** | Contract signing | Geen directe relatie |
| **Uitgaaf** | Budgettering | Geen directe relatie |
| **Agendi** | Agendabeheer | Potentieel: trainingsschema's koppelen |
| **Vlottr** | Auto verhuur Limburg | Geen relatie |
| **Athletic Academy** | Fitness & coaching platform | Dit project |

### Gedeelde patronen in het ecosysteem

- React/TypeScript als frontend standaard
- Tailwind CSS voor styling
- Vite als build tool
- Zelfde GitHub workflow via SandeDesign organisatie
- Make.com als automation laag (in andere projecten)
- PHP proxy op eigen host voor server-side calls (in andere projecten — niet in dit project)
- Firebase voor real-time data en auth (dit project specifiek)

---

*Gegenereerd via CLAUDE.md basis template — SandeDesign*
*Laatst bijgewerkt: 2026-03-16*
