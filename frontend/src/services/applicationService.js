import api from './api'

export const applicationService = {
  getAll() {
    return api.get('/applications')
  },
  getById(id) {
    return api.get(`/applications/${id}`)
  },
  create(payload) {
    return api.post('/applications', payload)
  },
  update(id, payload) {
    return api.put(`/applications/${id}`, payload)
  },
  remove(id) {
    return api.delete(`/applications/${id}`)
  },
}
