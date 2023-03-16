import { http } from '@/utils/http'
import type { ResponsePage } from '~/types/http'
import type { DefectVo } from '@/views/testing/defect/type/response'
import type { DefectSearchParam } from '@/views/testing/defect/type/request'

export default {
  searchDefect: (param: DefectSearchParam) => http.get<DefectSearchParam, ResponsePage<DefectVo>>('/defect/search', param),
  updateDefect: (param: DefectVo) => http.put<DefectVo, DefectVo>('/defect/update', param),
  saveDefect: (param: DefectVo) => http.post<DefectVo, DefectVo>('/defect/save', param),
  deleteDefect: (id: number) => http.delete<void, void>(`/defect/delete/${id}`),
}
