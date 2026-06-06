import { useQuery } from '@tanstack/react-query'
import { applicationService } from '../services/applicationService'

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await applicationService.getAll()
      return data
    },
  })
}
