import type { AxiosResponse } from 'axios'
import { apiClient } from './api'
import { paramsGenerator } from '@/utils/paramsGenerator'

export const authService = {
  async getStaging(payload: any): Promise<AxiosResponse<any>> {
    return apiClient.get<any>(`/auth/staging?${paramsGenerator(payload)}`)
  },
}
