import type { ETWDynamic, SelectDynamicAdminParam } from '@/views/community/dynamic/type/request'
import { http } from '@/utils/http'
import type { ResponsePage } from '~/types/http'
import type { DynamicWithUserProfile } from '@/views/community/dynamic/type/response'

export default {
  getDynamic: (params: SelectDynamicAdminParam) => http.get<SelectDynamicAdminParam, ResponsePage<DynamicWithUserProfile>>('/admin/dynamic', params),
  updateDynamic: (params: ETWDynamic) => http.put<ETWDynamic, void>('/admin/dynamic/', params),
  deleteDynamic: (id: number) => http.delete<number, void>(`/admin/dynamic/${id}`),
}
