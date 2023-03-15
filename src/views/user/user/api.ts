import type { GetUserListParam } from '@/views/user/user/type/request'
import { http } from '@/utils/http'
import type { UserListVo } from '@/views/user/user/type/response'
import type { ResponsePage } from '~/types/http'

export default {
  getUserList: (params: GetUserListParam) => http.get<GetUserListParam, ResponsePage<UserListVo>>('/admin/user/profile', params),
  lockUser: (params: { userId?: number;lock?: boolean }) => http.put<any, void>(`/admin/user/${params.userId}/lock/${params.lock}`),
}
