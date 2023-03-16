import { http } from '@/utils/http'
import type { TestingCase, TestingCaseSearchDto } from '@/views/testing/case/type/request'
import type { TestingCaseVo } from '@/views/testing/case/type/response'
import type { ResponsePage } from '~/types/http'

export default {
  saveCase: (param: TestingCase) => http.post<TestingCase, TestingCase>('/testing/case/save', param),
  updateCase: (param: TestingCase) => http.put<TestingCase, TestingCase>('/testing/case/update', param),
  deleteCase: (id: number) => http.delete<void, void>(`/testing/case/delete/${id}`),
  searchCase: (param: TestingCaseSearchDto) => http.post<TestingCaseSearchDto, ResponsePage<TestingCaseVo>>('/testing/case/search', param),
}
