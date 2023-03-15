import type { BasePageParam } from '~/types/http'

export interface MedalQueryParam extends BasePageParam {
  name?: string
  stat?: number
  desc?: string
}
