import api from './api'

export const documentService = {
  getAll() {
    return api.get('/documents')
  },
  upload(payload) {
    return api.post('/documents/upload', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  remove(id) {
    return api.delete(`/documents/${id}`)
  },
}
