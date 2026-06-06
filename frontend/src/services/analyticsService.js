import api from './api'

export const analyticsService = {
  get() {
    return api.get('/analytics')
  },
}
