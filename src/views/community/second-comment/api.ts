import { http } from '@/utils/http'
import type { ResponsePage } from '~/types/http'
import type { AdminGetSecondCommentParam } from '@/views/community/second-comment/type/request'
import type { SecondCommentVo } from '@/views/community/second-comment/type/response'

export default {
  getSecondCommentList: (params: AdminGetSecondCommentParam) => http.get<AdminGetSecondCommentParam, ResponsePage<SecondCommentVo>>('/admin/comment/second/list', params),
  deleteSecondComment: (id: number) => http.delete<number, void>(`/admin/comment/second/${id}`),
}
