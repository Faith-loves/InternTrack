import { useQuery } from '@tanstack/react-query'
import { applicationService } from '../services/applicationService'
import { isDemoSession } from '../utils/authStorage'
import { getDemoWorkspace } from '../utils/demoWorkspace'

export function useApplications() {
  const isDemo = isDemoSession()

  return useQuery({
    queryKey: ['applications', isDemo ? 'demo' : 'live'],
    queryFn: async () => {
      if (isDemo) return getDemoWorkspace().applications

      const { data } = await applicationService.getAll()
      return data
    },
  })
}
