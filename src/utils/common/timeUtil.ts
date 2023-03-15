import moment from 'moment'
import type { MomentInput } from 'moment/moment'

// 长时间
export const timeFormat = (value: MomentInput, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(value).format(format)
}
