import { http } from '@/utils/http'
import type { MedalQueryParam } from '@/views/operation/medal/type/request'
import type { Medal } from '@/views/community/dynamic/type/response'
import type { ResponsePage } from '~/types/http'

export default {
  getMedal: (queryParam: MedalQueryParam) => http.get<MedalQueryParam, ResponsePage<Medal>>('/admin/medal', queryParam),

}
