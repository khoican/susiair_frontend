# Susi Air Pilot App — Frontend

Aplikasi web **mobile-first** (Nuxt 3) untuk pilot Susi Air: memantau jam terbang terhadap batas duty, masa berlaku dokumen, dan jadwal bulanan. Frontend ini mengonsumsi REST API backend; tidak ada data mock di sisi klien.

Dokumen sumber:

- [`docs/PRD.md`](docs/PRD.md) — kebutuhan produk, acceptance criteria, Decision Log, edge case (otoritas utama).
- [`docs/API_SPEC.md`](docs/API_SPEC.md) — kontrak endpoint, envelope respons, sampel.
- [`docs/DESIGN.md`](docs/DESIGN.md) — token visual, tipografi, spacing, shadow.

## Setup & Instalasi

Prasyarat:

- Node.js 20+
- pnpm

Langkah:

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Server dev berjalan di `http://localhost:3000`.

### Environment

| Variabel                | Wajib | Default                                                  | Keterangan              |
| ----------------------- | ----- | -------------------------------------------------------- | ----------------------- |
| `NUXT_PUBLIC_API_BASE`  | tidak | `https://susiairbackend-production.up.railway.app/api`   | Base URL REST API backend |

### Perintah

```bash
pnpm dev          # server dev (http://localhost:3000)
pnpm build        # build produksi
pnpm preview      # pratinjau build produksi
pnpm test         # seluruh test (Vitest)
pnpm test:unit    # project unit
pnpm test:nuxt    # project nuxt (happy-dom)
pnpm lint         # eslint .
pnpm typecheck    # nuxt typecheck
```

## Fitur

- **Sign In (`/login`)** — autentikasi username/password, JWT disimpan di cookie, error alert untuk kredensial salah.
- **Home Dashboard (`/`)** — sapaan pilot + total jam terbang, 4 kartu batas (Daily/Weekly/Monthly/Annual), trend chart rolling sum dengan toggle range `1w`/`1m`/`3m`/`6m`/`1y`, daftar dokumen dengan badge urgensi, bottom navigation.
- **Schedule (`/schedule`)** — kalender bulanan dengan navigasi bulan, warna pangkalan dinamis, indikator penyelesaian duty, dan legend.

Rincian acceptance criteria per fitur ada di [`docs/PRD.md`](docs/PRD.md) §6.

## Keputusan

Ringkasan Decision Log (lengkap di [`docs/PRD.md`](docs/PRD.md) §16):

| ID  | Keputusan |
| --- | --------- |
| D1  | Anchor date tetap `2026-05-15` menggantikan "hari ini" |
| D2  | Semua kalkulasi jam terbang authoritative di backend |
| D3  | No Local Mock — semua data dari REST API |
| D4  | Token JWT disimpan di cookie key `auth_token` |
| D5  | `limitLine`, `yMax`, `limit`, `badgeColor` berasal dari API |
| D6  | Future zeroing — jam terbang tanggal `> 2026-05-15` dihitung `0.0` |
| D7  | Badge urgensi dipercayakan ke API, compute hanya fallback |
| D8  | Duty indicator memakai `isCompleted` dari API |
| D9  | Field kalender memakai `base_name` |
| D10 | Styling SCSS murni (bukan Tailwind / UI kit) |
| D11 | Logout client-side tanpa endpoint backend |

## Rencana Next Version

- Fitur **Logbook** (tab saat ini placeholder).
- Halaman **More** (tab saat ini placeholder).
- **Detail per-tanggal** dari sel kalender (saat ini placeholder "Detail page coming soon").
- Tooling analytics (event tracking belum diputuskan).
- Pembersihan dependency/modul tak terpakai.
- Pertimbangan i18n & mode offline.

## Kontribusi

Baca [`AGENTS.md`](AGENTS.md) sebelum menulis, mengubah, atau menghapus kode.
