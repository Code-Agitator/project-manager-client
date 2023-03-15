import {http} from '@/utils/http'
import {UserLoginParam} from "@/views/login/type/request";
import {TokenInfo} from "~/types/http";

export default {
  login: (data:UserLoginParam) => http.post<UserLoginParam,TokenInfo>('/user/login', data),
}
