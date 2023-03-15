import {http} from '@/utils/http'
import {UserProfileExtVo} from './type'
export default {
  getUser: () => http.get<void,UserProfileExtVo>('/user/current/info'),
  refreshToken: () => http.post('/auth/refreshToken'),
}
