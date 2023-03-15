import { http } from '@/utils/http'
import type { AdminGetCommentParam } from '@/views/community/comment/type/request'
import type { ResponsePage } from '~/types/http'
import type { AdminCommentVo } from '@/views/community/comment/type/response'

export default {
  getCommentList: (params: AdminGetCommentParam) => http.get<AdminGetCommentParam, ResponsePage<AdminCommentVo>>('/admin/comment/list', params),
  deleteComment: (id: number) => http.delete<number, void>(`/admin/comment/${id}`),
}
