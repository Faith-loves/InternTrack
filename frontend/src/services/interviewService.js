import api from './api'

export const interviewService = {
  getAll() {
    return api.get('/interviews')
  },
  create(payload) {
    return api.post('/interviews', payload)
  },
  update(id, payload) {
    return api.put(`/interviews/${id}`, payload)
  },
}
