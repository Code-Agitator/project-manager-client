import { http } from '@/utils/http'
import type { UserSearchParam } from '@/views/system/user/type/request'
import type { User, UserVo } from '@/views/system/user/type/response'
import type { ResponsePage } from '~/types/http'
export default {
  searchUser: (param: UserSearchParam) => http.post<UserSearchParam, ResponsePage<UserVo>>('/user/search', param),
  updateUser: (param: User) => http.put<User, User>('/user/update', param),
  saveUser: (param: User) => http.post<User, User>('/user/save', param),
  deleteUser: (id: number) => http.delete<void, void>(`/user/delete/${id}`),
}
