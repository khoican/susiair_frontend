# AGENTS.md — Aturan Kerja Frontend Susi Air Pilot App

Aturan ini mengikat **setiap agen AI maupun developer** yang bekerja di repo ini. Baca dokumen ini sebelum menulis, mengubah, atau menghapus apa pun.

---

## 1. Peran & Scope Repo

Repo ini adalah **frontend** Susi Air Pilot App: aplikasi web *mobile-first* (Nuxt 3) untuk pilot memantau jam terbang, batas duty, dokumen, dan jadwal. Backend REST terpisah; frontend hanya mengonsumsi API.

Sebelum berkoding, baca dulu dokumen sumber di `docs/`.

## 2. Source of Truth

Urutan otoritas (yang lebih atas menang):

1. **`docs/PRD.md`** — acceptance criteria, Decision Log (D1–D11), edge case. Otoritas utama.
2. **`docs/API_SPEC.md`** — bentuk teknis endpoint, envelope respons, sampel. Menang untuk detail kontrak API.
3. **`docs/DESIGN.md`** — token visual, tipografi, spacing, shadow.

Bila kode yang ada bertentangan dengan dokumen ini, **dokumen yang menang** — perbaiki kode, bukan dokumen, kecuali perubahan disetujui eksplisit.

## 3. Stack Terkunci

**Gunakan:**
- Nuxt 3 + Vue 3 Composition API (`<script setup>`) + TypeScript.
- State: Pinia (`@pinia/nuxt`).
- Styling: **SCSS murni** (`sass`) + CSS Variables dari `assets/scss/_variables.scss`.
- Icons: `lucide-vue-next`.
- Font: Plus Jakarta Sans (`@fontsource/plus-jakarta-sans`).
- Charts: `chart.js` + `vue-chartjs` + `chartjs-plugin-annotation`.
- HTTP: `$fetch`/`useFetch` via composable `useApi.ts`.

**Dilarang:**
- Tailwind (`tailwindcss`), `ant-design-vue`, `@ant-design-vue/nuxt`, `@nuxt/ui`.
- Seluruh paket `@tiptap/*` (tidak ada rich text editor di scope).
- Menambah dependency baru tanpa alasan kuat — pakai yang sudah terpasang dulu.

## 4. Aturan Data (WAJIB)

- **No Local Mock** — dilarang menyimpan/memakai file JSON mock di frontend. Semua data dari REST API.
- Semua request lewat `useApi()` yang: meng-unwrap `{ statusCode, data }`, menyisipkan `Authorization: Bearer <token>` dari cookie `auth_token`, dan normalisasi `message` (string|string[]) menjadi string.
- Respons `401` dari endpoint terproteksi → `authStore.logout()` → redirect `/login`.
- **Anchor date `2026-05-15`** menggantikan "hari ini" untuk seluruh kalkulasi (rolling sum, `daysRemaining`, penempatan kalender). Jangan pakai tanggal sistem.
- Nilai `limit`, `limitLine`, `yMax`, `badgeColor`, `isCompleted` **diambil dari API**; jangan hardcode atau hitung ulang di frontend (fallback compute hanya bila field API kosong — lihat PRD D7).
- Field kalender memakai `base_name` (bukan `base_code`).

## 5. Konvensi Kode

- Semua komponen pakai `<script setup>` + TypeScript.
- Struktur: `components/{common,home,schedule}`, `composables/`, `stores/`, `middleware/`, `pages/`.
- SCSS memakai token dari `_variables.scss`; jangan hardcode warna hex yang sudah punya token.
- **Komentar: DILARANG keras** menulis/menyisipkan komentar yang tidak perlu saat menulis, mengubah, atau menghapus kode/file/directory.
- **JSDoc: WAJIB** untuk memberi keterangan pada setiap function (composable, action store, util, function komponen). Gunakan blok `/** ... */` dengan `@param`, `@returns`, dan `@throws`/`@example` bila relevan. Tipe tetap dari TypeScript; JSDoc pelengkap, bukan pengganti tipe. Arrow callback inline sepele (mis. `arr.map(x => x + 1)`) dikecualikan.
- Jangan log token/PII ke console.

Contoh JSDoc:

```ts
/**
 * Mengambil profil pilot beserta total jam terbang.
 *
 * @returns Profil pilot dari endpoint `GET /api/pilot/me`.
 * @throws {Error} Bila request gagal dan tidak dapat dipulihkan.
 */
async function fetchPilot(): Promise<PilotProfile> {
  return await useApi()('/pilot/me')
}
```

## 6. Commands

Package manager: **pnpm**.

```bash
pnpm install          # pasang dependency
pnpm dev              # server dev (http://localhost:3000)
pnpm build            # build produksi
pnpm preview          # pratinjau build
pnpm test             # seluruh test (Vitest)
pnpm test:unit        # project unit
pnpm test:nuxt        # project nuxt (happy-dom)
pnpm lint             # eslint .
pnpm typecheck        # nuxt typecheck
```

Wajib jalankan `pnpm lint` dan `pnpm typecheck` setelah perubahan kode. Kalau perintahnya tidak ada/gagal, laporkan — jangan diamkan.

## 7. Struktur Project

```text
frontend/
├── assets/scss/           # _variables.scss, _global.scss, main.scss
├── components/
│   ├── common/            # AppHeader, BottomNav, StatusBadge
│   ├── home/              # LimitCard, TrendChart, DocumentList
│   └── schedule/          # CalendarGrid, DutyLegend
├── composables/useApi.ts
├── middleware/auth.ts
├── pages/                 # login.vue, index.vue, schedule.vue
├── stores/                # auth.ts, pilot.ts, documents.ts, schedule.ts
├── app.vue
└── nuxt.config.ts
```

## 8. Git

- **Jangan** commit, amend, push, atau buat PR kecuali diminta eksplisit.
- Sebelum commit (bila diminta): periksa `git status`, `git diff`, `git log --oneline -10`; stage hanya file yang relevan; jangan commit secret.
- Jangan ubah `git config`, jangan force-push, jangan commit kosong.

## 9. Testing

- Vitest, dua project: `unit` (`test/unit/*.test.ts`) dan `nuxt` (`test/nuxt/*.test.ts`, happy-dom).
- Logika non-trivial (branch, loop, parser, path uang/keamanan) wajib meninggalkan **satu** self-check runnable. Test trivial tidak perlu.

## 10. Definition of Done

Sebuah perubahan dianggap selesai bila:

- [ ] Acceptance criteria terkait di `docs/PRD.md` terpenuhi.
- [ ] Semua data dari API, tanpa mock (jika menyentuh data).
- [ ] `pnpm lint` dan `pnpm typecheck` bersih.
- [ ] Setiap function ber-JSDoc; tidak ada komentar berlebih; tidak ada kode/file/directory yang tidak perlu.
- [ ] Tidak ada link/klaim yang menunjuk ke file atau endpoint yang tidak ada.
