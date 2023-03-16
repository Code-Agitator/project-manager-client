import { http } from '@/utils/http'
import type { TestingPlan, TestingPlanSearchDto } from '@/views/testing/plan/type/request'
import type { ResponsePage } from '~/types/http'
import type { TestingPlanVo } from '@/views/testing/plan/type/response'
export default {
  searchPlan: (param: TestingPlanSearchDto) => http.post<TestingPlanSearchDto, ResponsePage<TestingPlanVo>>('/testing/plan/search', param),
  savePlan: (param: TestingPlan) => http.post<TestingPlan, TestingPlan>('/testing/plan/save', param),
  updatePlan: (param: TestingPlan) => http.put<TestingPlan, TestingPlan>('/testing/plan/update', param),
  deletePlan: (id: number) => http.delete<void, void>(`/testing/plan/delete/${id}`),
}
