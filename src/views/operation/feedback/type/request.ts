import type { BasePageParam } from '~/types/http'

export interface AdminGetFeedbackParam extends BasePageParam {
  stat?: number
  timeStart?: number
  timeEnd?: number
}
