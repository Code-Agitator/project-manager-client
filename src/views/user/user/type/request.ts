import type { BasePageParam } from '~/types/http'

export interface GetUserListParam extends BasePageParam {
  keywords?: string
}
