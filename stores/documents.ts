import type { DocumentItem } from '~/types/api'

/**
 * Store daftar dokumen pilot.
 *
 * @returns State dan aksi dokumen (items, loading, error).
 */
export const useDocumentsStore = defineStore('documents', () => {
  const items = ref<DocumentItem[]>([])
  const loading = ref(false)
  const error = ref('')

  /**
   * Mengambil daftar dokumen dari `GET /documents`.
   *
   * @throws {Error} Bila request gagal.
   */
  async function fetchDocuments(): Promise<void> {
    items.value = await useApi()<DocumentItem[]>('/documents')
  }

  return { items, loading, error, fetchDocuments }
})
