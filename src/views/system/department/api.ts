import { http } from '@/utils/http'
import type { ResponsePage } from '~/types/http'
import type { DepartmentSearchParam } from '@/views/system/department/type/request'
import type { DepartmentVo } from '@/views/system/department/type/response'
import type { Department } from '@/views/system/user/type/response'
export default {
  searchDepartment: (param: DepartmentSearchParam) => http.get<DepartmentSearchParam, ResponsePage<DepartmentVo>>('/department/search', param),
  saveDepartment: (param: Department) => http.post<Department, Department>('/department/save', param),
  updateDepartment: (param: Department) => http.put<Department, Department>('/department/update', param),
  deleteDepartment: (id: number) => http.delete(`/department/delete/${id}`),
}
