import api from './api'

export const notificationService = {
  getAll() {
    return api.get('/notifications')
  },
}
