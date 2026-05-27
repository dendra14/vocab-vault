# VocabVault

Kamus pribadi berbasis web untuk menyimpan dan mengelola kata atau istilah baru dengan definisi versi sendiri.

## Tech Stack

- **Next.js 14** — App Router
- **Tailwind CSS v4**
- **Supabase** — Database & Authentication

## Fitur

- Autentikasi multi-user (register & login)
- CRUD vocabulary (tambah, lihat, edit, hapus)
- Filter berdasarkan kategori
- Search real-time
- Sort kata (terbaru, A-Z, favorit, dll)
- Tandai kata sebagai favorit
- Export vocabulary ke CSV
- Dark mode & Light mode
- Responsive di semua device

## Kategori yang Tersedia

`general` `tech` `english` `ekonomi` `sains` `lainnya`

## Cara Menjalankan Lokal

### 1. Clone repository

```bash
git clone https://github.com/USERNAME/vocabvault.git
cd vocabvault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Supabase

- Buat project baru di [supabase.com](https://supabase.com)
- Buka **SQL Editor** dan jalankan query berikut:

```sql
create table vocabularies (
  id        uuid default gen_random_uuid() primary key,
  user_id   uuid references auth.users not null,
  term      text not null,
  definition text not null,
  example   text,
  category  text default 'general',
  is_favorite boolean default false,
  created_at timestamptz default now()
);

alter table vocabularies enable row level security;

create policy "Users manage own vocab"
  on vocabularies
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

- Di **Authentication → Providers → Email**: aktifkan Email provider, matikan Confirm email
- Di **Authentication → Settings**: aktifkan "Allow new users to sign up"

### 4. Buat file `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Folder

```
vocabvault/
├── app/
│   ├── (auth)/
│   │   ├── login/page.jsx
│   │   └── register/page.jsx
│   └── (app)/
│       ├── layout.jsx
│       └── vault/
│           ├── page.jsx
│           ├── new/page.jsx
│           └── [id]/page.jsx
├── components/
│   └── ui/
│       ├── Toast.jsx
│       └── useToast.jsx
├── lib/
│   ├── supabase.js
│   ├── supabase-server.js
│   ├── ThemeContext.jsx
│   └── vocab.js
└── .env.local
```

## Deploy

Project ini siap di-deploy ke [Vercel](https://vercel.com). Tambahkan environment variables `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di dashboard Vercel.

---

Dibuat oleh [dendra14](https://github.com/dendra14)
