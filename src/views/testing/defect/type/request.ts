import type { BasePageParam } from '~/types/http'
import type { DefectVo } from '@/views/testing/defect/type/response'

export interface DefectSearchParam extends BasePageParam, Partial<DefectVo> {

}
