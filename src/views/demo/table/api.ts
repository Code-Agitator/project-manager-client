import {http} from '@/utils/http'

export default {
  getPosts: () => http.get('/table/posts'),
}
