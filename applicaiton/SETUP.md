# Leaseon - Setup Guide

## Oversigt

Leaseon er en billeasing-markedsplads bygget med:
- **Frontend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Styling**: Tailwind CSS + SCSS

---

## Hurtig Start

### 1. Opret Supabase Projekt

1. Gå til [supabase.com](https://supabase.com) og opret en konto
2. Klik "New Project"
3. Vælg et navn og region (EU Central anbefales for Danmark)
4. Vent på at projektet er klar

### 2. Kør Database Schema

1. I Supabase Dashboard, gå til **SQL Editor**
2. Klik "New Query"
3. Kopier hele indholdet fra `supabase-schema.sql`
4. Klik "Run" for at køre scriptet

Dette opretter:
- Alle nødvendige tabeller
- RLS (Row Level Security) policies
- RPC funktioner
- Seed data (bilmærker og udstyr)

### 3. Hent API Nøgler

1. I Supabase Dashboard, gå til **Settings** > **API**
2. Kopier:
   - **Project URL** (f.eks. `https://xxxx.supabase.co`)
   - **anon public** nøglen

### 4. Konfigurer Environment Variables

1. Kopier `.env.local.example` til `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Udfyld værdierne i `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://DIT-PROJEKT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key-her
   NEXT_PUBLIC_FS_DOMAIN=https://fs.leaseon.dk
   NEXT_PUBLIC_FS_SECRET=din-upload-nøgle
   ```

### 5. Installer Dependencies

```bash
cd applicaiton
npm install
```

### 6. Start Development Server

```bash
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000)

---

## Database Struktur

### Tabeller

| Tabel | Beskrivelse |
|-------|-------------|
| `profiles` | Brugerprofiler (linket til Supabase Auth) |
| `carbrands` | Bilmærker (Audi, BMW, etc.) |
| `equipment` | Udstyr/features (Aircondition, GPS, etc.) |
| `carlistings` | Bilannoncer |
| `carlistingequipment` | Junction tabel: annonce ↔ udstyr |
| `listingimages` | Billeder til annoncer |

### Relationer

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
carlistings (1:mange)
    ↓
├── listingimages (1:mange)
├── carlistingequipment → equipment (mange:mange)
└── carbrands (mange:1)
```

---

## Fil Upload

Billeder uploades til en ekstern fil-server (`fs.leaseon.dk`). 

Hvis du vil bruge din egen fil-server:
1. Serveren skal have en `/upload` endpoint
2. Den skal acceptere `multipart/form-data` med en `file` felt
3. Den skal returnere JSON med `uuid` felt
4. Sæt `NEXT_PUBLIC_FS_DOMAIN` til din server URL
5. Sæt `NEXT_PUBLIC_FS_SECRET` til din upload nøgle

### Alternativ: Brug Supabase Storage

For at bruge Supabase Storage i stedet, skal du modificere `utils/img.ts`.

---

## Sider

### Offentlige Sider
- `/` - Forside med hero, rabatter, nyeste annoncer
- `/biler` - Søg og filtrer annoncer
- `/biler/[id]` - Enkelt annonce

### Dashboard (kræver login)
- `/dashboard` - Login side
- `/dashboard/biler` - Mine annoncer
- `/dashboard/biler/opret` - Opret ny annonce
- `/dashboard/biler/[id]` - Rediger annonce
- `/dashboard/profil` - Min profil

---

## Scripts

```bash
# Development
npm run dev

# Produktion build
npm run build

# Start produktion server
npm run start

# Lint
npm run lint
```

---

## Fejlfinding

### "Invalid API key"
- Tjek at dine Supabase nøgler er korrekte i `.env.local`
- Sørg for at bruge `anon` nøglen, ikke `service_role`

### "Permission denied" / RLS fejl
- Kør hele `supabase-schema.sql` scriptet igen
- Tjek at RLS policies er oprettet korrekt

### Billeder vises ikke
- Tjek `NEXT_PUBLIC_FS_DOMAIN` er korrekt
- Sørg for fil-serveren er tilgængelig

### Kan ikke logge ind
- Supabase Auth er automatisk aktiveret
- Tjek at email confirmation er slået fra i Supabase:
  - Gå til **Authentication** > **Providers** > **Email**
  - Slå "Confirm email" fra for nemmere test

---

## Produktion

### Vercel Deploy

1. Push til GitHub
2. Importer projekt i Vercel
3. Tilføj environment variables
4. Deploy

### Environment Variables i Vercel

Tilføj disse i Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_FS_DOMAIN`
- `NEXT_PUBLIC_FS_SECRET`
