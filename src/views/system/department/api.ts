import { http } from '@/utils/http'
import type { ResponsePage } from '~/types/http'
import type { DepartmentSearchParam } from '@/views/system/department/type/request'
import type { DepartmentVo } from '@/views/system/department/type/response'
export default {
  searchDepartment: (param: DepartmentSearchParam) => http.get<DepartmentSearchParam, ResponsePage<DepartmentVo>>('/department/search', param),
}
