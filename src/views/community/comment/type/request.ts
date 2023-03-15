import type { BasePageParam, TargetParam } from '~/types/http'

export interface AdminGetCommentParam extends BasePageParam, TargetParam {
  keywords?: string
  userId?: number
  deleted?: boolean
  timeStart?: number
  timeEnd?: number
}
