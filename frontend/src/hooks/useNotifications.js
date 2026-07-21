import { useQuery } from '@tanstack/react-query'
import { notificationService } from '../services/notificationService'
import { isDemoSession } from '../utils/authStorage'
import { demoNotifications } from '../utils/demoData'

export function useNotifications() {
  const isDemo = isDemoSession()

  return useQuery({
    queryKey: ['notifications', isDemo ? 'demo' : 'live'],
    queryFn: async () => {
      if (isDemo) return demoNotifications

      const { data } = await notificationService.getAll()
      return data
    },
  })
}
