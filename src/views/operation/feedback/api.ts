import { http } from '@/utils/http'
import type { ResponsePage } from '~/types/http'
import type { AdminGetFeedbackParam } from '@/views/operation/feedback/type/request'
import type { Feedback } from '@/views/operation/feedback/type/response'

export default {
  getFeedbackList: (params: AdminGetFeedbackParam) => http.get<AdminGetFeedbackParam, ResponsePage<Feedback>>('/admin/feedback/list', params),
  updateFeedbackStat: (params: { id: number;stat: number }) => http.put<void, void>(`/admin/feedback/${params.id}/stat/${params.stat}`),
}
