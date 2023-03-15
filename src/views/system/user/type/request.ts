import type { BasePageParam } from '~/types/http'

export interface UserSearchParam extends BasePageParam {
  departmentId?: number
  startDate?: string
  endDate?: string
  name?: string
  phone?: string
  roleId?: number
  status?: number
}
