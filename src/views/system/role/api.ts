import { http } from '@/utils/http'
import type { ResponsePage } from '~/types/http'
import type { Role } from '@/views/system/role/type/response'
import type { RoleDeleteParam, RoleSaveData, RoleSearchParam } from '@/views/system/role/type/request'

export default {
  searchRole: (param: RoleSearchParam) => http.get<RoleSearchParam, ResponsePage<Role>>('/role/search', param),
  saveRole: (data: RoleSaveData) => http.post<RoleSaveData, Role>('/role/save', data),
  updateRole: (data: RoleSaveData) => http.put<RoleSaveData, Role>('/role/update', data),
  deleteRole: (param: RoleDeleteParam) => http.delete<RoleDeleteParam, Role>(`/role/delete/${param.id}`),
}
