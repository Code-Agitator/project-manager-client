import { http } from '@/utils/http'
import type { SystemStatistical } from '@/views/workbench/type/response'

export default {
  getStatistical: () => http.get<void, SystemStatistical>('/admin/system/properties/statistical'),
}
