import type { BasePageParam } from '~/types/http'

export interface AdminGetSecondCommentParam extends BasePageParam {
  keywords?: string
  userId?: number
  deleted?: boolean
  commentId?: number
  timeStart?: number
  timeEnd?: number
}
