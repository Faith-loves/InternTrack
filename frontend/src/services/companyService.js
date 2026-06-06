import api from './api'

export const companyService = {
  getAll() {
    return api.get('/companies')
  },
  create(payload) {
    return api.post('/companies', payload)
  },
}
