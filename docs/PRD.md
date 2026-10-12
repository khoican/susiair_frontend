# Product Requirements Document — Susi Air Pilot App (Frontend)

**Nama Produk:** Susi Air Pilot App — Operational Web Tool (Frontend)
**Status:** In Review
**Author:** Tim Frontend (AI Agent + Developer)
**Stakeholders:** Product Owner, Engineering Lead, Design Lead, QA Lead
**Date Created:** 2026-10-12
**Last Updated:** 2026-10-12
**Version:** 1.1

> **Dokumen ini adalah single source of truth** untuk pembangunan antarmuka pengguna (frontend) Susi Air Pilot App. Setiap agen AI maupun developer wajib mengikuti kontrak di dokumen ini. Bila ada pertentangan antara dokumen ini dengan file lain di repo, **dokumen ini yang menang**. BRIEF.md lama sudah digantikan oleh PRD ini. Kontrak API detail ada di `docs/API_SPEC.md`; PRD ini adalah otoritas atas acceptance criteria, decision log, dan edge case.

> **⚠️ Aturan Data Global (WAJIB):**
>
> 1. **Anchor date `2026-05-15`** menggantikan "hari ini" untuk **seluruh** kalkulasi (rolling sum, `daysRemaining` dokumen, penempatan kalender). Frontend tidak boleh memakai tanggal sistem sebagai pengganti anchor.
> 2. **Future zeroing** — jam terbang bertanggal `> 2026-05-15` dihitung `0.0`.
> 3. **Rolling sum** titik `T` = total jam pada rentang `[T - (windowDays - 1), T]`.
> 4. **Pembulatan 1 desimal** untuk `cards.*.current`, `flight-hours.hours`, dan `chart.series[].sum`.
> 5. Seluruh data dari REST API. **Dilarang** mock JSON lokal di frontend.
> 6. Kredensial demo: `johndoe` / `passjhondoe`.

---

## 1. Executive Summary

**One-liner:** Aplikasi web mobile-first untuk pilot Susi Air guna memantau jadwal terbang, jam terbang terhadap batas regulasi, dan masa berlaku dokumen.

**Overview:**
Susi Air Pilot App adalah *mobile-first operational web tool* yang dibangun dengan Nuxt 3. Aplikasi ini menyajikan tiga layar utama: Sign In (`/login`), Home Dashboard (`/`), dan Schedule/Calendar (`/schedule`). Tujuan utamanya mengurangi ketergantungan pada pemeriksaan manual (spreadsheet atau tanya admin) terhadap jam terbang kumulatif dan masa berlaku dokumen pilot yang diatur regulasi penerbangan.

Data **wajib** diambil dari REST API backend. Frontend tidak boleh menyimpan atau memakai file mock JSON. Semua state dikelola melalui Pinia, dengan injeksi JWT Bearer di lapisan composable `useApi`.

**Quick Facts:**
- **Target Users:** Pilot Susi Air (operasional, mobile, di lapangan/pesawat).
- **Problem Solved:** Pilot tidak punya visibilitas real-time terhadap jam terbang kumulatif vs. batas duty (daily/weekly/monthly/annual) dan masa berlaku dokumen (licensi, security clearance).
- **Key Metric:** Waktu yang dibutuhkan pilot untuk tahu sisa jam & status dokumen turun dari menit ke detik; nol pelanggaran batas duty yang tidak terdeteksi.
- **Target Launch:** PENDING (lihat §14 Open Questions).

---

## 2. Table of Contents

1. [Problem Statement](#3-problem-statement)
2. [Goals & Objectives](#4-goals--objectives)
3. [User Personas](#5-user-personas)
4. [User Stories & Requirements](#6-user-stories--requirements)
5. [Success Metrics](#7-success-metrics)
6. [Scope](#8-scope)
7. [Technical Considerations](#9-technical-considerations)
8. [Design & UX Requirements](#10-design--ux-requirements)
9. [Timeline & Milestones](#11-timeline--milestones)
10. [Risks & Mitigation](#12-risks--mitigation)
11. [Dependencies & Assumptions](#13-dependencies--assumptions)
12. [Open Questions](#14-open-questions)
13. [Stakeholder Sign-Off](#15-stakeholder-sign-off)
14. [Decision Log](#16-decision-log)
15. [Edge Cases](#17-edge-cases)

---

## 3. Problem Statement

### The Problem
Pilot Susi Air tidak memiliki alat self-service untuk memantau (a) akumulasi jam terbang terhadap empat batas duty regulasi, dan (b) tenggat masa berlaku dokumen wajib. Informasi ini tersebar dan diakses secara manual, sehingga rawan keterlambatan deteksi.

### Current State
Pilot memeriksa jam terbang dengan bertanya ke admin atau membaca catatan terpisah. Masa berlaku dokumen diingat manual atau lewat pengingat pribadi. This is error-prone.

### Impact

**User Impact:**
- Pilot kehilangan waktu untuk mendapat status jam terbang & dokumen.
- Risiko melewati batas duty tanpa sadar akibat data kumulatif yang tidak real-time.

**Business Impact:**
- Kepatuhan regulasi penerbangan berisiko (temuan audit).
- Beban administratif pada admin meningkat karena permintaan cek manual.

### Why Now?
Kebutuhan operational visibility yang mobile-first, agar pilot dapat mengecek status dari perangkat genggam sebelum/sesudah misi.

---

## 4. Goals & Objectives

### Business Goals
1. **Kepatuhan regulasi:** Pilot selalu dapat melihat jam terbang vs. batas duty dan status dokumen tanpa perantara.
2. **Efisiensi admin:** Mengurangi permintaan cek manual ke tim admin.
3. **Kualitas operasional:** Menstandarkan tampilan data penerbangan melalui satu aplikasi web.

### User Goals
1. **Visibilitas limit:** Melihat Daily (vs 8), Weekly (vs 40), Monthly (vs 100), Annual (vs 1050) jam terbang saat ini.
2. **Early warning dokumen:** Mengetahui dokumen yang `Safe`, `Soon`, atau `Expired`.
3. **Rencana jadwal:** Melihat kalender bulanan dengan kode pangkalan, warna, dan indikator penyelesaian tugas.

### Non-Goals
- Menggantikan sistem backend/sumber data penerbangan.
- Fitur Logbook penuh dan menu "More" (hanya placeholder di fase ini, §8).
- Editing data (input logbook, edit jadwal) — read-only pada fase ini.
- Detail per-tanggal untuk kalender (hanya placeholder "Detail page coming soon").

---

## 5. User Personas

### Primary Persona: Capt. John Doe — Pilot Operasional

**Demographics:**
- Age range: 25–55
- Role/Title: Pilot Susi Air
- Tech savviness: Medium (nyaman dengan aplikasi mobile)
- Location: Berpindah antar pangkalan di Indonesia

**Behaviors:**
- Mengecek aplikasi di sela-sela misi, sering hanya dengan satu tangan.
- Bergantung pada sinyal seluler yang tidak selalu stabil.

**Needs & Motivations:**
- Tahu sisa jam terbang sebelum batas before takeoff.
- Tahu dokumen mana yang harus segera diperpanjang.

**Pain Points:**
- Data jam terbang tidak tersentralisasi.
- Tidak ada peringatan dini masa berlaku dokumen.

**Quote:** _"Saya cuma butuh lihat dari HP: sisa jam saya berapa, dan dokumen apa yang mau habis."_

---

## 6. User Stories & Requirements

### Epic A: Authentication

#### Story A-1: Sign In (P0)

**User Story:**
```
Sebagai pilot,
saya ingin masuk dengan username dan password,
supaya saya dapat mengakses dashboard operasional saya.
```

**Acceptance Criteria:**
- [ ] Halaman `/login` menampilkan logo Susi Air, input Username, input Password, dan tombol utama "Sign In" (pill, warna brand red).
- [ ] Tidak ada header atas maupun bottom navigation di `/login`.
- [ ] Given kredensial valid, when "Sign In" ditekan, then `authStore.login()` dipanggil, JWT disimpan di cookie, dan user diarahkan ke `/`.
- [ ] Given API mengembalikan `401 Unauthorized`, when login gagal, then tampil Error Alert Card; field tidak direset.
- [ ] Edge case: tombol dalam state loading/disabled saat request berjalan (cegah double submit).

**Priority:** Must Have (P0) · **Effort:** M · **Dependencies:** endpoint `POST /api/auth/login`

---

#### Story A-2: Route Guard (P0)

**User Story:**
```
Sebagai sistem,
saya ingin melindungi halaman yang butuh login,
supaya data pilot tidak diakses tanpa autentikasi.
```

**Acceptance Criteria:**
- [ ] Given tidak ada token, when mengakses path selain `/login`, then redirect ke `/login`.
- [ ] Given ada token, when mengakses `/login`, then redirect ke `/`.
- [ ] Middleware berlaku global pada semua route terproteksi.

**Priority:** Must Have (P0) · **Effort:** XS · **Dependencies:** story A-1

---

### Epic B: Home Dashboard (`/`)

#### Story B-1: Header Pilot (P0)

**Acceptance Criteria:**
- [ ] Menampilkan sapaan "Good day,", nama pilot, total flight hours (mis. `1,444.5 hrs`), dan avatar.
- [ ] Data dari `GET /api/pilot/me` (`name`, `totalFlightHours`, `avatarUrl`).
- [ ] Nilai numerik memakai bobot font 700/800.

**Priority:** Must Have (P0) · **Effort:** S · **Dependencies:** endpoint `GET /api/pilot/me`

---

#### Story B-2: Hours-to-Limit (4 kartu) (P0)

**Acceptance Criteria:**
- [ ] Grid 2×2 menampilkan 4 kartu dari respons `cards`: Daily (`current` vs `limit`), Weekly, Monthly, Annual.
- [ ] Setiap kartu menampilkan `current / limit hrs` dan indikator rasio (progress bar).
- [ ] Kartu tetap rapi walau `current > limit` (tidak overflow).
- [ ] Nilai `current` & `limit` diambil apa adanya dari API (`cards.daily/weekly/monthly/annual`), bukan dihitung ulang di frontend.
- [ ] Kartu dan chart di-fetch dari **satu** endpoint `GET /api/flight-hours/summary` (story B-3).

**Priority:** Must Have (P0) · **Effort:** M · **Dependencies:** endpoint `GET /api/flight-hours/summary`

---

#### Story B-3: Trend Chart + Toggle Range (P0)

**Acceptance Criteria:**
- [ ] Toggle button group: `1w`, `1m`, `3m`, `6m`, `1y` (default `1w`).
- [ ] Setiap klik toggle memicu fetch ulang ke `GET /api/flight-hours/summary?range=...` (dynamic, bukan cache statis).
- [ ] Grafik memakai `chart.series[]` dari API — **tepat 15 titik** harian terurut naik, anchor `2026-05-15` di indeks ke-7 (`series[0]=2026-05-08`, `series[7]=2026-05-15`, `series[14]=2026-05-22`).
- [ ] Garis limit merah horizontal memakai nilai `chart.limitLine` dari API (bukan konstanta frontend), sesuai range: `1w=40`, `1m=100`, `3m=300`, `6m=600`, `1y=1050`.
- [ ] Sumbu Y maksimum dikunci ke `chart.yMax` dari API: `45`, `125`, `325`, `625`, `1200`.
- [ ] Grafik tetap merender garis limit + kurva tanpa merusak kontainer meski data `> limit`.
- [ ] Kurva/bar berwarna `--color-chart-accent` (`#22C5E8`).

**Priority:** Must Have (P0) · **Effort:** L · **Dependencies:** endpoint `GET /api/flight-hours/summary`, Chart.js + vue-chartjs + chartjs-plugin-annotation

---

#### Story B-4: My Documents (P0)

**Acceptance Criteria:**
- [ ] Menampilkan daftar dari `GET /api/documents` (5 item; mis. "Indonesian License Exp. Date", "Security Clearance Exp. Date").
- [ ] Badge urgensi di kanan memakai `status` + `badgeColor` dari API: `safe`=`#1FBF8F`, `soon`=`#F59E0B`, `expired`=`#E63757`.
- [ ] **Fallback compute** (hanya bila `status`/`badgeColor` kosong): Green/`Safe` jika `daysRemaining > 30`; Amber/`Soon` jika `0 < daysRemaining <= 30`; Red/`Expired` jika `daysRemaining <= 0`.
- [ ] `daysRemaining` dihitung relatif anchor `2026-05-15` (bukan tanggal sistem).

**Priority:** Must Have (P0) · **Effort:** M · **Dependencies:** endpoint `GET /api/documents`

---

#### Story B-5: Bottom Navigation (P0)

**Acceptance Criteria:**
- [ ] 4 tab: Home (aktif di `/`), Schedule, Logbook (disabled/placeholder), More (disabled/placeholder).
- [ ] Navigasi fixed di bawah kontainer.
- [ ] Tab non-aktif yang disabled tidak menavigasi ke mana pun.

**Priority:** Must Have (P0) · **Effort:** S · **Dependencies:** —

---

### Epic C: Schedule (`/schedule`)

#### Story C-1: Calendar Header Controls (P0)

**Acceptance Criteria:**
- [ ] Tombol `<` dan `>` plus label bulan/tahun (mis. `May 2026`).
- [ ] Setiap perpindahan bulan memicu `GET /api/schedules?year=YYYY&month=MM`.

**Priority:** Must Have (P0) · **Effort:** S · **Dependencies:** endpoint `GET /api/schedules`

---

#### Story C-2: Monthly Calendar Grid (P0)

**Acceptance Criteria:**
- [ ] Header hari: `Sun Mon Tue Wed Thu Fri Sat`.
- [ ] Tiap sel menampilkan nomor tanggal dan `base_name` pangkalan (mis. `PDG`, `SIQ`) di bawahnya.
- [ ] Background sel diisi warna hex dinamis dari atribut `base_color` API (bukan warna hardcoded).
- [ ] Duty Status Indicator kanan-atas: ikon tick jika `isCompleted === true`; jika tidak, tampilkan angka sisa `count_schedules - count_logbooks`.
- [ ] `isCompleted` dipakai langsung dari API (fallback: hitung `count_logbooks === count_schedules`).

**Priority:** Must Have (P0) · **Effort:** L · **Dependencies:** endpoint `GET /api/schedules`

---

#### Story C-3: Duty Legend (P1)

**Acceptance Criteria:**
- [ ] Menampilkan list/grid keterangan warna dari array `legend` API (10 kode; mis. `DTY - On Duty`, `SCK - Sick`, `RLV - Requested Leave`).
- [ ] Warna tiap item memakai `legend[].color` dari API.

**Priority:** Should Have (P1) · **Effort:** S · **Dependencies:** endpoint `GET /api/schedules`

---

#### Story C-4: Date Click Placeholder (P2)

**Acceptance Criteria:**
- [ ] Klik sel tanggal menampilkan modal/toast: **"Detail page coming soon"**.

**Priority:** Nice to Have (P2) · **Effort:** XS · **Dependencies:** story C-2

---

### Functional Requirements

| Req ID | Deskripsi | Prioritas | Status |
|--------|-----------|-----------|--------|
| FR-001 | Login username/password + simpan JWT di cookie | Must Have | Open |
| FR-002 | Route guard global berbasis keberadaan token | Must Have | Open |
| FR-003 | Dashboard menampilkan jam terbang vs 4 batas duty | Must Have | Open |
| FR-004 | Trend chart dengan toggle range + limit line + Y-max terkunci | Must Have | Open |
| FR-005 | Daftar dokumen dengan badge urgensi | Must Have | Open |
| FR-006 | Bottom nav 4 tab (2 placeholder) | Must Have | Open |
| FR-007 | Kalender bulanan dengan warna `base_color` dinamis | Must Have | Open |
| FR-008 | Duty status indicator per tanggal | Must Have | Open |
| FR-009 | Duty legend dari API | Should Have | Open |
| FR-010 | Placeholder modal saat tanggal diklik | Nice to Have | Open |
| FR-011 | Injeksi Bearer JWT pada semua request API | Must Have | Open |
| FR-012 | Auto-logout saat API mengembalikan 401 | Must Have | Open |

### Non-Functional Requirements

| Req ID | Kategori | Deskripsi | Target |
|--------|----------|-----------|--------|
| NFR-001 | Layout | Lebar kontainer app maksimum | `430px`, terpusat, background netral |
| NFR-002 | Responsiveness | Mobile-first | Prioritas 360–430px; desktop hanya membingkai kontainer |
| NFR-003 | Data Integrity | No Local Mock | 100% data dari REST API; dilarang mock JSON di frontend |
| NFR-004 | Chart Safety | Grafik robust | Tetap render limit line + kurva saat data > limit |
| NFR-005 | Accessibility | Baseline a11y | Semantik HTML, kontras teks 4.5:1, fokus terlihat |
| NFR-006 | Standards | Composition API | Semua komponen pakai `<script setup>` + TypeScript |
| NFR-007 | Security | Token storage | JWT di cookie, key tunggal `auth_token` (lihat §14) |

---

## 7. Success Metrics

### Key Performance Indicators (KPIs)

#### Primary Metric (North Star)
**Metric:** **Time-to-Insight** — waktu dari membuka app sampai pilot tahu sisa jam terbang & status dokumen.
**Definition:** Selisih waktu buka app → semua kartu limit & dokumen ter-render.
**Current Baseline:** Tidak terukur (proses manual).
**Target:** < 3 detik pada koneksi 4G (data ter-cache setelah fetch pertama).
**Why This Metric:** Inti value app adalah kecepatan visibilitas operasional.

#### Secondary Metrics

| Metric | Current | Target | Timeframe |
|--------|---------|--------|-----------|
| Login success rate (kredensial valid) | — | > 99% | Launch |
| Chart render tanpa error pada data > limit | — | 100% | Launch |
| Akurasi badge urgensi vs. `status` API | — | 100% cocok | QA |
| Waktu interaksi toggle range (refetch) | — | < 1.5s | Launch |

### Measurement Framework

**Framework Used:** HEART (Task Success & Engagement pada konteks operasional)

- **Happiness:** Keluhan pilot soal kerumitan akses data (target: turun).
- **Engagement:** Frekuensi buka app per pilot per minggu.
- **Adoption:** % pilot aktif memakai app dalam 30 hari.
- **Retention:** Pilot kembali membuka dalam 7 hari berikutnya.
- **Task Success:** % sesi yang berhasil memuat dashboard & kalender tanpa error.

### Analytics Implementation

**Events to Track (PENDING — menunggu keputusan tooling analytics):**
- `login_success` / `login_failed`
- `range_toggle_changed`
- `calendar_month_changed`
- `document_badge_viewed`

*Catatan: jangan menambahkan SDK analytics apa pun sebelum tooling disetujui (§14).*

---

## 8. Scope

### In Scope

**Phase 1 (MVP):**
- Autentikasi (login, logout, route guard).
- Home dashboard: header pilot, 4 kartu limit, trend chart + toggle, daftar dokumen + badge, bottom nav.
- Schedule: kalender bulanan, warna dinamis, duty indicator, legend, placeholder modal.
- Lapisan API (`useApi`) + 4 store Pinia (`auth`, `pilot`, `documents`, `schedule`).

**Phase 2 (Post-MVP):**
- Fitur Logbook.
- Halaman "More".
- Detail per-tanggal dari kalender.

### Out of Scope

**Explicitly Excluded:**
- **Mock data / file JSON lokal** — dilarang keras; semua data dari REST API.
- **Input/editing data** (logbook entry, edit jadwal) — app read-only pada fase ini.
- **Fitur Logbook & More penuh** — hanya placeholder tab.
- **Offline/PWA mode** — belum dipertimbangkan.
- **Multi-bahasa (i18n)** — teks statis, belum ada permintaan.
- **`GET /api/flight-hours?from&to`** — tersedia di backend tapi tidak dipakai layar mana pun pada fase ini.

### Future Considerations
- Notifikasi push untuk dokumen mendekati kedaluwarsa.
- Detail jadwal per tanggal.
- Mode offline dengan sinkronisasi.

---

## 9. Technical Considerations

### High-Level Architecture
Aplikasi Nuxt 3 (SSR/SSG hybrid) bertindak sebagai frontend SPA-ish. Semua data melalui `useApi()` (`$fetch.create`) dengan injeksi `Authorization: Bearer <token>` dari cookie `auth_token`. State di Pinia. Tidak ada backend-for-frontend; frontend memanggil REST API backend langsung via `runtimeConfig.public.apiBase`.

```
[Browser] --cookie(auth_token)--> [Nuxt SSR/Client]
     |                                   |
     |                          useApi() $fetch + Bearer JWT
     |                                   v
     +---------> [REST API: https://susiairbackend-production.up.railway.app/api]
```

### Technology Stack

**LOCKED — Frontend:**
- **Framework:** Nuxt 3 (Vue 3, Composition API, `<script setup>`), TypeScript.
- **State:** Pinia (`@pinia/nuxt`).
- **Styling:** SCSS/SASS murni (`sass`) + CSS Variables. **Bukan** Tailwind.
- **Icons:** `lucide-vue-next`.
- **Fonts:** Plus Jakarta Sans (bobot 400/500/600/700/800) via `@fontsource/plus-jakarta-sans`.
- **Charts:** `chart.js` + `vue-chartjs` (dengan plugin anotasi limit-line).
- **HTTP:** Nuxt `$fetch`/`useFetch` via composable `useApi.ts`.

**Dependency cleanup (WAJIB dihapus/abaikan sebelum Phase 1):**
- Hapus `tailwindcss`, `ant-design-vue`, `@ant-design-vue/nuxt`, `@nuxt/ui` dari config/deps.
- Hapus seluruh paket `@tiptap/*` (tidak relevan — tidak ada rich text editor di scope).
- Evaluasi modul tak terpakai: `@nuxt/content`, `@nuxt/scripts`, `@artmizu/nuxt-prometheus`, `@askdoppler/nuxt`, `@arkenv/nuxt`, `@nuxt/hints`, `@pinia/colada`, `pinia-plugin-unstorage` — hapus yang tidak dipakai (lihat §14).

**Modules yang dipertahankan (minimum):** `@pinia/nuxt`, `@nuxt/image`, `@nuxt/test-utils/module`, `@nuxt/eslint`, `@nuxt/a11y` (opsional untuk baseline a11y).

### Project Structure (LOCKED)

```text
frontend/
├── assets/scss/
│   ├── _variables.scss    # Token warna, font, radius, mixin
│   ├── _global.scss       # Reset, base typography, body
│   └── main.scss          # Entry, import variables + global
├── components/
│   ├── common/            # AppHeader, BottomNav, StatusBadge
│   ├── home/              # LimitCard, TrendChart, DocumentList
│   └── schedule/          # CalendarGrid, DutyLegend
├── composables/useApi.ts  # $fetch wrapper + Bearer JWT + 401 handling
├── middleware/auth.ts     # Route guard
├── pages/                 # login.vue, index.vue, schedule.vue
├── plugins/api.ts         # (opsional) setup instance API
├── stores/               # auth.ts, pilot.ts, documents.ts, schedule.ts
├── app.vue                # NuxtLayout/NuxtPage + RouteAnnouncer
├── nuxt.config.ts
└── tsconfig.json
```

### API Requirements

> **Status: LOCKED** — disinkronkan dengan `docs/API_SPEC.md`. Bila keduanya berbeda, `API_SPEC.md` menang untuk bentuk teknis; PRD menang untuk acceptance criteria & edge case.

**Base URL:** `https://susiairbackend-production.up.railway.app`, prefix global `/api` → `runtimeConfig.public.apiBase` (env `NUXT_PUBLIC_API_BASE`), default `https://susiairbackend-production.up.railway.app/api`.

**Envelope respons:**
- Sukses: `{ "statusCode": <int>, "data": <payload> }`. Khusus login ada `message` tambahan.
- Error: `{ "statusCode": <int>, "message": <string | string[]>, "error": <string> }`. `404` mengembalikan plain 404 **tanpa** body JSON, `500` `{ statusCode: 500, message: "Internal server error", error: "Internal Server Error" }`.
- **`useApi` wajib** meng-unwrap `.data` dan menormalkan `message` (bila array → gabung/ambil elemen pertama) menjadi string untuk ditampilkan.

**Endpoints:**

| Metode & Path | Param | Respons (`data`) | Dipakai |
|---------------|-------|------------------|---------|
| `POST /api/auth/login` | body `{ username, password }` | `{ accessToken, pilot: { id, name, username } }` (+ `message`) | Login |
| `GET /api/pilot/me` | — | `{ name, totalFlightHours, avatarUrl }` | Header Home |
| `GET /api/flight-hours/summary` | `range` = `1w`\|`1m`\|`3m`\|`6m`\|`1y` (default `1w`) | `{ cards: { daily, weekly, monthly, annual }, chart: { range, limitLine, yMax, series[15] } }` | Kartu limit + chart |
| `GET /api/documents` | — | `Array<{ id, label, expiryDate, daysRemaining, status, badgeColor }>` (5 item) | My Documents |
| `GET /api/schedules` | `year` (int/`YYYY`), `month` (int/`MM`) | `{ legend[10], schedules[] }` | Kalender |
| `GET /api/flight-hours` | `from`, `to` (`YYYY-MM-DD`) | `Array<{ date, hours }>` | **TIDAK DIPAKAI** (out-of-scope) |

`cards.*` = `{ current, limit }`. `chart.series[]` = 15 entri `{ date, sum }` terurut naik. `schedules[]` = `{ id, duty_date, status, base_name, base_color, duty_type, count_schedules, count_logbooks, isCompleted }`.

Semua endpoint terproteksi JWT **kecuali** `POST /api/auth/login`.

### Security Requirements
- **Authentication:** JWT Bearer di header `Authorization: Bearer <accessToken>`.
- **Token storage:** cookie via `useCookie('auth_token')`. Key tunggal `auth_token` (resolusi konflik BRIEF §5.1 `token` vs §6/§7 `auth_token`). Token diambil dari `data.accessToken` saat login.
- **Auto-logout:** respons `401` dari endpoint terproteksi memicu `authStore.logout()` (clear cookie → redirect `/login`).
- **Logout:** murni client-side (hapus cookie + state). **Tidak ada** endpoint `/api/auth/logout`.
- **Login error:** `401` → tampilkan `message`; `400` → tampilkan array `message` validasi; jangan reset field.
- **Data:** hanya data pilot yang login; tidak ada PII/token yang di-log ke console.

### Performance Requirements
- First contentful paint dashboard < 3s pada 4G.
- Refetch toggle range < 1.5s.
- Chart tidak memblokir render kartu limit (progressive render).

### Data Considerations
- Tidak ada storage data flight di frontend selain token & cache Pinia in-memory.
- Format tanggal mengikuti ISO dari API; format tampilan `MMM YYYY` (mis. `May 2026`) dan `#,##0.0 hrs`.

---

## 10. Design & UX Requirements

### User Experience Principles
1. Mobile-first, satu tangan.
2. Kejelasan numerik (bobot 700/800 untuk data).
3. Sinyal urgensi instan (warna badge).

### User Flows

**Primary Flow (checks status):**
1. Buka app → middleware cek token.
2. Belum login → redirect `/login` → sign in → redirect `/`.
3. Dashboard memuat header, 4 kartu limit, chart, dokumen.
4. (Opsional) buka tab Schedule → ganti bulan → lihat kalender.

**Error Flow:**
- Login gagal (401) → Error Alert Card di `/login`.
- Token kadaluarsa (401 di mana pun) → logout → `/login`.

### Visual Design
- **Sumber token:** `docs/DESIGN.md` (authoritative) + `assets/scss/_variables.scss`.
- **Warna:** text/primary `#0E2138`, accent/danger `#E63757`, success `#1FBF8F`, warning `#F59E0B`, chart-accent `#22C5E8`, background `#F5F6F8`, surface `#FFFFFF`, text-muted `#6B7280`.
- **Radius:** card `14px`, button pill `9999px`.
- **Shadow card:** `0 2px 8px rgba(14, 33, 56, 0.05)`.
- **Font:** Plus Jakarta Sans.

### Interaction Patterns
- Toggle range chart (segmented control).
- Navigasi bulan via tombol `<`/`>`.
- Klik tanggal → toast/modal placeholder.

### Accessibility (a11y)
- Semantik HTML; kontras ≥ 4.5:1; fokus terlihat; alt untuk avatar/logo.
- Target: WCAG 2.1 Level AA (baseline).

### Responsive Design
- **Mobile:** 360px–430px (primary).
- **Tablet/Desktop:** kontainer tetap max 430px, terpusat, background netral.
- Breakpoint mengikuti DESIGN.md: `[360, 430, 768, 1024, 1280]`.

---

## 11. Timeline & Milestones

**Target Launch Date:** PENDING (§14)

| Phase | Deliverables | Owner | Start | End |
|-------|-------------|-------|-------|-----|
| Discovery | PRD final, API spec disinkronkan | PM/Eng | — | — |
| Design | Token SCSS, komponen dasar | Design | — | — |
| Development | Auth → Home → Schedule | Eng | — | — |
| QA | Acceptance criteria terverifikasi | QA | — | — |
| Launch | Rilis produksi | Eng | — | — |

---

## 12. Risks & Mitigation

| Risiko | Impact | Probability | Mitigasi | Owner |
|--------|--------|-------------|----------|-------|
| Kontrak API bergeser dari `API_SPEC.md` | Medium | Low | PRD & API_SPEC di-review bersama; `API_SPEC.md` menang untuk bentuk teknis | PM/Eng |
| Overflow chart saat data > limit | Medium | Medium | Uji eksplisit + `yMax` dari API | Eng |
| Kebocoran token via console/log | High | Low | Larang logging token; review kode | Eng |
| Scope creep (Logbook/More) | Medium | Medium | Placeholder tegas, §8 out-of-scope | PM |
| Sisa dependensi stack lama (Tailwind/ant/Tiptap) bikin konflik | Medium | Medium | Bersihkan di awal Phase 1 | Eng |

---

## 13. Dependencies & Assumptions

### Dependencies
**Internal:**
- [x] Spec API backend — tersedia di `docs/API_SPEC.md`.
- [ ] Token desain final di `docs/DESIGN.md`.

**External:**
- [ ] Ketersediaan REST API di `apiBase` (`susiairbackend-production.up.railway.app`).
- [ ] Paket npm: `sass`, `chart.js`, `vue-chartjs`, `chartjs-plugin-annotation`, `lucide-vue-next`, `@fontsource/plus-jakarta-sans`.

### Assumptions
- Data pilot & jam terbang dihitung authoritative oleh backend; frontend tidak menghitung ulang rolling sum.
- Nilai limit duty & range bersumber dari API (`cards.*.limit`, `chart.limitLine`, `chart.yMax`).
- Aplikasi read-only pada fase ini.

---

## 14. Open Questions

- [ ] **Tooling analytics**
  - **Context:** §7; jangan pasang SDK sebelum diputuskan.
- [ ] **Pembersihan dependensi/modul**
  - **Context:** Repo punya banyak modul tak terpakai; perlu approval daftar yang dihapus (§9).
- [ ] **Target launch date**
  - **Context:** §11 masih kosong.

> Item lama yang sudah terjawab: kontrak API (→ `API_SPEC.md`), sumber nilai limit (→ dari API), endpoint dokumen & profil pilot (→ `/api/documents`, `/api/pilot/me`).

---

## 15. Stakeholder Sign-Off

| Stakeholder | Role | Review Status | Approved | Date |
|------------|------|---------------|----------|------|
| — | Product Lead | ⏳ Pending | ☐ | - |
| — | Engineering Lead | ⏳ Pending | ☐ | - |
| — | Design Lead | ⏳ Pending | ☐ | - |
| — | QA Lead | ⏳ Pending | ☐ | - |

---

## 16. Decision Log

| ID | Keputusan | Alasan | Sumber |
|----|-----------|--------|--------|
| D1 | Anchor date tetap `2026-05-15` menggantikan "hari ini" | Assessment berbasis data mock statis; hasil deterministik | API_SPEC §5 |
| D2 | Semua kalkulasi jam terbang authoritative di backend | Frontend tak menduplikasi logika rolling sum | API_SPEC §3 |
| D3 | Prinsip *No Local Mock* | Data wajib dari REST API | BRIEF §9 |
| D4 | Token JWT disimpan di cookie key `auth_token` | Menyatukan konflik BRIEF `token` vs `auth_token` | §9 |
| D5 | Nilai `limitLine`, `yMax`, `limit`, `badgeColor` berasal dari API | Hindari konstanta ganda yang bisa divergen | API_SPEC §3 |
| D6 | **Future zeroing** — jam terbang tanggal `> 2026-05-15` dihitung `0.0` | Data mock hanya sampai `2026-05-31`; hari ke depan belum terjadi | API_SPEC §3, §5 |
| D7 | Badge urgensi dipercayakan ke API (`status`/`badgeColor`), compute hanya fallback | Sumber tunggal kebenaran threshold | §6 B-4 |
| D8 | Duty indicator memakai `isCompleted` dari API | Field eksplisit, kurangi logika frontend | API_SPEC §3 |
| D9 | Field kalender memakai `base_name` (bukan `base_code`) | Menyesuaikan kontrak API | API_SPEC §3 |
| D10 | Styling SCSS murni (bukan Tailwind/UI kit) | Sesuai BRIEF; hindari sistem style bertumpuk | PRD §9 |
| D11 | Logout client-side tanpa endpoint backend | Backend tidak menyediakan `/auth/logout` | API_SPEC §1 |

---

## 17. Edge Cases

| Skenario | Perilaku yang Diharapkan |
|----------|--------------------------|
| `range` di luar enum (`1w/1m/3m/6m/1y`) | API `400` dengan `message[]`; UI tampilkan error, chart tidak rusak |
| Tanggal `from`/`to` bukan ISO 8601 | API `400`; tidak relevan UI (endpoint tak dipakai) |
| Bulan kalender tanpa data | `schedules: []` — render grid kosong, bukan error |
| Data jam terbang `> limit` | Garis limit + kurva tetap render; `yMax` dari API mencegah overflow |
| `GET /` tak dikenal backend | `404` plain tanpa body → guard `useApi` jangan crash saat `response._data` null |
| Validasi body/query gagal | `400`, `message` **array** → normalisasi jadi string sebelum tampil |
| Token tidak valid / kedaluwarsa | `401` → auto-logout → `/login` |
| Login kredensial salah | `401` message string → Error Alert Card |
| `status`/`badgeColor` dokumen kosong | Fallback compute dari `daysRemaining` |

---

## Appendix

### Related Documents
- `docs/API_SPEC.md` — kontrak & sampel respons REST API (authoritative untuk bentuk teknis).
- `docs/DESIGN.md` — design token (authoritative untuk visual).

### Glossary
- **Rolling sum:** akumulasi jam terbang bergulir dalam rentang waktu (`[T-(windowDays-1), T]`).
- **Anchor date:** `2026-05-15`, pengganti "hari ini" untuk seluruh kalkulasi.
- **Limit line:** garis merah pada chart menandai batas duty range (`chart.limitLine`).
- **daysRemaining:** selisih hari sampai kedaluwarsa dokumen, relatif anchor.
- **base_name / base_color:** nama (kode) dan warna pangkalan pada kalender.
- **isCompleted:** penanda penyelesaian tugas (`count_logbooks === count_schedules`) dari API.
- **Duty status indicator:** penanda penyelesaian tugas per tanggal (tick atau angka sisa).

### Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-10-12 | Tim Frontend | Draft awal; menggantikan BRIEF.md |
| 1.1 | 2026-10-12 | Tim Frontend | Sinkronisasi dengan `docs/API_SPEC.md`: anchor `2026-05-15`, kontrak endpoint & envelope, `base_name`/`isCompleted`/`badgeColor`, Decision Log (D1–D11) & Edge Cases; Open Questions diperbarui |
