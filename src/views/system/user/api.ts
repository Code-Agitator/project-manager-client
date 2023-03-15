import { http } from '@/utils/http'
import type { UserSearchParam } from '@/views/system/user/type/request'
import type { UserVo } from '@/views/system/user/type/response'
import type { ResponsePage } from '~/types/http'
export default {
  searchUser: (param: UserSearchParam) => http.get<UserSearchParam, ResponsePage<UserVo>>('/user/search', param),
}
