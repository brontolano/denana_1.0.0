# Den Ana — Design System

> Sistem desain internal untuk aplikasi manajemen retail Den Ana.
> Tema: Cerdas, Energik, Bersih, Profesional namun mudah didekati.
> Target: Seluruh staf perusahaan retail dari level staff hingga admin.

---

## 1. Visual Theme & Atmosphere

**Mood:** Modern, cerdas, dinamis, percaya diri, ramah.

Den Ana menggabungkan nuansa biru profesional dengan aksen oranye energik — mencerminkan keseimbangan antara keandalan (data akurat, stok terkendali) dan semangat tim (gerak cepat, kolaborasi).

- **Kesan utama**: Gudang yang terorganisir, transaksi yang lancar, tim yang solid
- **Kepadatan visual**: Clean, spacious, tidak terlalu ramai — staf perlu scan data cepat
- **Tone**: Ramah dan membantu, bukan kaku korporat
- **Bahasa**: Bahasa Indonesia (ramah), istilah teknis dengan padanan Indonesia

**Kata kunci desain:** bersih, terang, terstruktur, berenergi, mendukung produktivitas.

---

## 2. Color Palette & Roles

### Primary — Biru (Keandalan & Profesionalisme)

| Token | Hex | Role |
|---|---|---|
| `--color-primary-50` | `#eff6ff` | Surface latar paling ringan |
| `--color-primary-100` | `#dbeafe` | Hover/selection ringan |
| `--color-primary-200` | `#bfdbfe` | Border ringan |
| `--color-primary-400` | `#60a5fa` | Hover state |
| `--color-primary` | `#3b82f6` | **CTA utama, tombol, link** |
| `--color-primary-600` | `#2563eb` | Tombol hover |
| `--color-primary-700` | `#1d4ed8` | Active/pressed state |
| `--color-primary-800` | `#1e40af` | Teks pada latar terang |

### Accent — Oranye (Energi & Aksi Cepat)

| Token | Hex | Role |
|---|---|---|
| `--color-accent-50` | `#fff7ed` | Surface notifikasi ringan |
| `--color-accent-100` | `#ffedd5` | Background badge |
| `--color-accent-200` | `#fed7aa` | Border aksen |
| `--color-accent` | `#f97316` | **Highlight, badge, quick-action** |
| `--color-accent-600` | `#ea580c` | Hover accent |
| `--color-accent-700` | `#c2410c` | Active accent |

### Neutral (Surface & Teks)

| Token | Hex | Role |
|---|---|---|
| `--color-white` | `#ffffff` | Kartu, modal, sidebar |
| `--color-gray-50` | `#f9fafb` | Halaman background |
| `--color-gray-100` | `#f3f4f6` | Section alternate |
| `--color-gray-200` | `#e5e7eb` | Border, divider |
| `--color-gray-300` | `#d1d5db` | Border disabled |
| `--color-gray-400` | `#9ca3af` | Placeholder, icon |
| `--color-gray-500` | `#6b7280` | Teks sekunder |
| `--color-gray-600` | `#4b5563` | Teks body |
| `--color-gray-700` | `#374151` | Teks heading |
| `--color-gray-800` | `#1f2937` | Teks judul utama |
| `--color-gray-900` | `#111827` | Teks emphasis |

### Semantic

| Token | Hex | Role |
|---|---|---|
| `--color-success` | `#10b981` | Stok cukup, transaksi sukses |
| `--color-warning` | `#f59e0b` | Stok menipis, peringatan |
| `--color-error` | `#ef4444` | Error, stok habis, gagal |
| `--color-info` | `#3b82f6` | Informasi sistem |
| `--color-success-bg` | `#ecfdf5` | Background sukses |
| `--color-warning-bg` | `#fffbeb` | Background peringatan |
| `--color-error-bg` | `#fef2f2` | Background error |

### Gradient

```css
--gradient-primary: linear-gradient(135deg, #3b82f6, #2563eb);
--gradient-accent: linear-gradient(135deg, #f97316, #ea580c);
--gradient-hero: linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #fff7ed 100%);
--gradient-card: linear-gradient(135deg, #60a5fa, #fbbf24);
```

---

## 3. Typography Rules

### Font Family

```css
--font-heading: 'Inter', system-ui, -apple-system, sans-serif;
--font-body: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Google Fonts:** Inter (300, 400, 500, 600, 700, 800)

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `--text-xs` | 0.75rem (12px) | 1.25 | 400 | Label, helper |
| `--text-sm` | 0.875rem (14px) | 1.375 | 400 | Body small, metadata |
| `--text-base` | 1rem (16px) | 1.5 | 400 | Body default |
| `--text-lg` | 1.125rem (18px) | 1.5 | 500 | Lead text |
| `--text-xl` | 1.25rem (20px) | 1.375 | 600 | Section heading |
| `--text-2xl` | 1.5rem (24px) | 1.25 | 700 | Page heading |
| `--text-3xl` | 1.875rem (30px) | 1.2 | 700 | Hero heading |
| `--text-4xl` | 2.25rem (36px) | 1.1 | 800 | Display hero |
| `--text-5xl` | 3rem (48px) | 1.05 | 800 | Large display |

### Rules

- **Body:** `--text-base` / 400, warna `--color-gray-600`
- **Heading:** `--text-2xl` / 700, warna `--color-gray-900`
- **Label form:** `--text-sm` / 500, warna `--color-gray-700`
- **Data/tabel:** Gunakan `--text-sm` / 400 untuk kepadatan informasi
- **Link:** `--color-primary`, underline on hover
- **Monospace:** Untuk kode, nomor referensi, ID transaksi

---

## 4. Component Stylings

### Button

| Variant | Background | Text | Border | Hover | Active |
|---|---|---|---|---|---|
| **Primary** | `--color-primary` | White | None | `--color-primary-600` | `--color-primary-700` |
| **Secondary** | Transparent | `--color-primary` | `--color-primary` | `--color-primary-50` | `--color-primary-100` |
| **Accent** | `--color-accent` | White | None | `--color-accent-600` | `--color-accent-700` |
| **Ghost** | Transparent | `--color-gray-600` | None | `--color-gray-100` | `--color-gray-200` |
| **Danger** | `--color-error` | White | None | `#dc2626` | `#b91c1c` |
| **Outline** | Transparent | `--color-gray-600` | `--color-gray-200` | `--color-gray-50` | `--color-gray-100` |

- **Border radius:** `0.5rem` (8px)
- **Padding:** `0.5rem 1rem` (sm), `0.625rem 1.25rem` (default), `0.75rem 1.5rem` (lg)
- **Transition:** `150ms ease` on all interactive states
- **Shadow:** `--shadow-sm` pada primary/accent

### Input & Form

- **Background:** `--color-white`
- **Border:** `--color-gray-200`, focus → `--color-primary`
- **Border radius:** `0.5rem` (8px)
- **Padding:** `0.625rem 0.875rem`
- **Label:** `--text-sm` / 500 / `--color-gray-700`
- **Placeholder:** `--color-gray-400`
- **Focus ring:** `0 0 0 3px rgba(59, 130, 246, 0.15)`
- **Error state:** Border `--color-error`, background `--color-error-bg`

### Card

- **Background:** `--color-white`
- **Border:** `1px solid --color-gray-200`
- **Border radius:** `0.75rem` (12px)
- **Padding:** `1.5rem`
- **Shadow:** `--shadow-sm`, hover → `--shadow-md`
- **Header:** `--text-lg` / 600, dengan divider bawah `--color-gray-100`

### Table / Data Grid

- **Header:** `--text-xs` / 600 / uppercase, background `--color-gray-50`
- **Row:** `--text-sm` / 400 / `--color-gray-600`
- **Row hover:** `--color-primary-50`
- **Border:** Horizontal `--color-gray-100` saja
- **Striped:** Optional, `--color-gray-50` untuk baris genap
- **Pagination:** `--text-sm`, active page → `--color-primary` bg + white text

### Badge / Tag

| Variant | Background | Text | Border |
|---|---|---|---|
| **Default** | `--color-gray-100` | `--color-gray-700` | None |
| **Success** | `--color-success-bg` | `--color-success` | None |
| **Warning** | `--color-warning-bg` | `--color-warning` | None |
| **Error** | `--color-error-bg` | `--color-error` | None |
| **Primary** | `--color-primary-50` | `--color-primary` | None |
| **Accent** | `--color-accent-50` | `--color-accent` | None |

- **Border radius:** `9999px` (pill)
- **Padding:** `0.125rem 0.625rem`
- **Font:** `--text-xs` / 500

### Navigation (Sidebar)

- **Background:** `--color-white`
- **Width:** 256px (collapsed: 64px)
- **Item active:** Background `--color-primary-50`, text `--color-primary`, left border 3px `--color-primary`
- **Item hover:** Background `--color-gray-50`
- **Icon:** 20px, warna `--color-gray-400`, active → `--color-primary`
- **Divider:** `--color-gray-100`

### Toast / Notification

- **Background:** `--color-gray-900` (dark), white (light)
- **Border radius:** `0.5rem` (8px)
- **Shadow:** `--shadow-lg`
- **Position:** Top-right, stackable
- **Duration:** Auto-dismiss after 4s (info) / 6s (error)
- **Icon:** Sesuai semantic color

### Modal / Dialog

- **Overlay:** `rgba(0, 0, 0, 0.4)`
- **Background:** `--color-white`
- **Border radius:** `0.75rem` (12px)
- **Shadow:** `--shadow-xl`
- **Max width:** 480px (default), 640px (large), 320px (small)
- **Animation:** Scale in (0.95 → 1.0) + fade in, 200ms
- **Close button:** Top-right, `--color-gray-400`, hover → `--color-gray-600`

---

## 5. Layout Principles

### Spacing Scale

```css
--space-1: 0.25rem  (4px)
--space-2: 0.5rem   (8px)
--space-3: 0.75rem  (12px)
--space-4: 1rem     (16px)
--space-5: 1.25rem  (20px)
--space-6: 1.5rem   (24px)
--space-8: 2rem     (32px)
--space-10: 2.5rem  (40px)
--space-12: 3rem    (48px)
--space-16: 4rem    (64px)
--space-20: 5rem    (80px)
```

### Grid

- **Page max-width:** 1280px
- **Content max-width:** 896px (untuk halaman baca)
- **Columns:** 12-column grid, gap `--space-6`
- **Sidebar + main:** 256px + 1fr (flex)

### Whitespace

- **Section padding:** `--space-12` vertikal (mobile: `--space-8`)
- **Card padding:** `--space-6` (mobile: `--space-4`)
- **Form spacing:** `--space-5` antar field
- **Paragraph spacing:** `--space-4`

### 8px Grid Base

Semua margin, padding, dan sizing menggunakan kelipatan 4px (4, 8, 12, 16, 20, 24, 32, ...).

---

## 6. Depth & Elevation

### Shadow Tokens

```css
--shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04);
--shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
--shadow-card-hover: 0 10px 15px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04);
```

### Elevation Layers

| Layer | Shadow | Usage |
|---|---|---|
| 0 (Base) | None | Halaman, konten |
| 1 (Card) | `--shadow-card` | Kartu, panel |
| 2 (Raised) | `--shadow-md` | Dropdown, popover |
| 3 (Overlay) | `--shadow-lg` | Modal, sidebar |
| 4 (Top) | `--shadow-xl` | Toast, dialog konfirmasi |

### Border Radius Scale

```css
--radius-sm: 0.375rem  (6px)
--radius-md: 0.5rem    (8px)
--radius-lg: 0.75rem   (12px)
--radius-xl: 1rem      (16px)
--radius-full: 9999px
```

---

## 7. Do's and Don'ts

### Do ✅
- Gunakan gradient biru-oranye hanya untuk section hero/header besar
- Teks utama di kartu selalu `--color-gray-900` untuk heading
- Setiap tabel harus punya row hover state (`--color-primary-50`)
- Gunakan badge semantic untuk status (aktif/habis/menipis)
- Tampilkan skeleton loading untuk data tabel
- Quick action buttons harus prominent dengan `--color-accent`
- Gunakan Bahasa Indonesia untuk semua label, pesan, dan tombol
- Nominal uang: Rp 50.000 (spasi setelah Rp, tanpa .00)
- Tanggal: format DD/MM/YYYY atau "12 Jul 2026"

### Don't ❌
- Jangan gunakan oranye sebagai primary — oranye hanya untuk aksi cepat
- Jangan buat terlalu banyak warna dalam satu halaman (max 3 warna dominan)
- Jangan gunakan shadow besar untuk kartu biasa (cukup `--shadow-card`)
- Hindari tabel horizontal scroll tanpa fixed column pertama
- Jangan gunakan gradient pada teks (kecuali hero heading besar)
- Hindari font dekoratif — tetap gunakan Inter
- Jangan gunakan bahasa Inggris untuk label sistem

---

## 8. Responsive Behavior

### Breakpoints

| Name | Min Width | Target |
|---|---|---|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop sidebar visible |
| `xl` | 1280px | Wide desktop |

### Layout Behavior

| Component | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|---|---|---|---|
| **Sidebar** | Hidden (hamburger menu) | Collapsed (icon only) | Full (256px) |
| **Data table** | Horizontal scroll + sticky first col | Full table | Full table |
| **Card grid** | 1 column | 2 columns | 3-4 columns |
| **Hero section** | Stack, reduced padding | Side-by-side | Full layout |
| **Modal** | Full-screen sheet | Centered modal | Centered modal |
| **Top nav** | Bottom tab bar | Top nav with icons | Full horizontal nav |

### Touch Targets

- Minimum touch target: 44x44px
- Tombol aksi floating: 56x56px
- Form input: min-height 44px

---

## 9. Agent Prompt Guide

Gunakan prompt berikut untuk meminta Claude Design menghasilkan komponen:

```
Berdasarkan DESIGN.md Den Ana:
- Buat [komponen] untuk halaman [nama halaman]
- Gunakan warna [primary/accent/success/warning/error]
- Sertakan [loading/empty/error state]
- Format data: [tabel/kartu/list]
- Aksi utama: [button/quick-action/link]
```

### Contoh Prompt

```
Berdasarkan DESIGN.md Den Ana:
- Buat halaman daftar produk dengan tabel yang menampilkan kode, nama, kategori, stok, harga jual, dan status
- Gunakan warna semantic untuk badge status (hijau=aktif, merah=habis, kuning=menipis)
- Sertakan filter dropdown untuk kategori dan status
- Aksi utama: Tombol "Tambah Produk" dengan warna primary
- Tampilkan skeleton loading saat data dimuat
- Responsive: tabel scroll horizontal di mobile
```

---

*Last updated: 2026-07-12*
