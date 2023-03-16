<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import defectApi from '@/views/testing/defect/api'
import departmentApi from '@/views/system/department/api'
import type { DefectVo } from '@/views/testing/defect/type/response'
import type { DepartmentVo } from '@/views/system/department/type/response'
import type { DefectSearchParam } from '@/views/testing/defect/type/request'

const editModalMode = ref<number>(1)
const tableData = ref<RowData[]>([])
const showEditModal = ref<boolean>(false)
const editModal = ref<DefectVo>({})
const loading = ref<boolean>(false)
const pagination = reactive<PaginationProps>({
  pageSize: 10,
})

interface RowData extends DefectVo {
}

const status: { [key: number]: string } = {
  0: '离职',
  1: '在职',
  2: '实习生',
}

type TagType = 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning'

const formatLevel: {
  [key: string]: { type: TagType; label: string } } = {
  death: { type: 'error', label: '致命' },
  important: { type: 'error', label: '严重' },
  normal: { type: 'warning', label: '普通' },
  low: { type: 'info', label: '轻微' },
  none: { type: 'success', label: '无' },
}

const formatPriority: {
  [key: string]: { type: TagType; label: string } } = {
  high: { type: 'error', label: '紧急' },
  mid: { type: 'warning', label: '中' },
  low: { type: 'info', label: '低' },
  delay: { type: 'success', label: '延迟' },
}

const formatType: {
  [key: string]: { type: TagType;label: string } } = {
  defect: { type: 'error', label: '缺陷' },
  improve: { type: 'warning', label: '改进' },
  experience: { type: 'success', label: '体验' },
}

const formatStatus: {
  [key: number]: { type: TagType; label: string } } = {
  1: { type: 'error', label: '待解决' },
  2: { type: 'warning', label: '正在解决' },
  3: { type: 'success', label: '已解决' },
  4: { type: 'info', label: '已关闭' },
}

const formatRepeatedProbability: {
  [key: string]: { type: TagType; label: string } } = {
  must: { type: 'error', label: '必然' },
  high: { type: 'error', label: '大概率' },
  mid: { type: 'error', label: '偶然' },
  low: { type: 'info', label: '难以浮现' },
  none: { type: 'success', label: '无' },
}

const queryForm = ref<DefectSearchParam>({})

const initTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  defectApi.searchDefect({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => { loading.value = false })
}
const handleDeleteDefect = async (id?: number) => {
  if (id === undefined)
    return
  try {
    await defectApi.deleteDefect(id)
    window.$message?.success('删除成功')
    initTableData()
  }
  catch (e) {
    window.$message?.error('删除失败')
  }
}
const columns: DataTableColumns<RowData> = [
  { title: '缺陷编号', key: 'id', width: 60, ellipsis: { tooltip: true } },
  { title: '缺陷标题', key: 'title', width: 150, ellipsis: { tooltip: true } },
  { title: '缺陷描述', key: 'comment', width: 150, ellipsis: { tooltip: true } },
  {
    title: '类型',
    key: 'type',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => h(
      NTag,
      { bordered: false, type: formatType[row.type ?? ''].type },
      { default: () => formatType[row.type ?? ''].label },
    ),
  },
  {
    title: '严重程度',
    key: 'level',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => h(
      NTag,
      { bordered: false, type: formatLevel[row.level ?? ''].type },
      { default: () => formatLevel[row.level ?? ''].label },
    ),
  },
  {
    title: '优先级',
    key: 'priority',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => h(
      NTag,
      { bordered: false, type: formatPriority[row.priority ?? ''].type },
      { default: () => formatPriority[row.priority ?? ''].label },
    ),
  },
  {
    title: '重复概率',
    key: 'repeatedProbability',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => h(
      NTag,
      { bordered: false, type: formatRepeatedProbability[row.repeatedProbability ?? ''].type },
      { default: () => formatRepeatedProbability[row.repeatedProbability ?? ''].label },
    ),
  },
  {
    title: '状态',
    key: 'status',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => h(
      NTag,
      { bordered: false, type: formatStatus[row.status as number].type },
      { default: () => formatStatus[row.status as number].label },
    ),
  },
  {
    title: '报告人',
    key: 'reportUser',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => row.reportUser?.username ?? '-',
  },
  {
    title: '经办人',
    key: 'user',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => row.user?.username ?? '-',
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render(row) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => {
              editModalMode.value = 2
              editModal.value = row
              showEditModal.value = true
            },
          },
          { default: () => '修改' },
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            style: { marginLeft: '10px' },
            onClick: () => handleDeleteDefect(row.id),
          },
          { default: () => '删除' },
        ),
      ]
    },
  },
]

const handelSaveBtnClick = async () => {
  try {
    if (editModalMode.value === 1)
      await defectApi.saveDefect(editModal.value)
    else
      await defectApi.updateDefect(editModal.value)
    window.$message?.success('修改成功')
    showEditModal.value = false
    initTableData()
  }
  catch (e) {
    window.$message?.error('修改失败')
  }
}

const departmentList = ref<DepartmentVo[]>([])
const getDepartmentList = async () => {
  const { data } = await departmentApi.searchDepartment({})
  departmentList.value = data?.records ?? []
}
getDepartmentList()

onMounted(() => {
  initTableData()
  pagination.onUpdatePage = (page) => {
    pagination.page = page
    initTableData()
  }
})
</script>

<template>
  <n-card h-full>
    <div bg-white w-full>
      <n-form
        label-placement="left"
        :model="queryForm"
      >
        <n-grid :cols="5" :x-gap="24">
          <n-form-item-gi label="缺陷标题">
            <n-input v-model:value="queryForm.title" />
          </n-form-item-gi>
          <n-form-item-gi label="严重程度">
            <n-select
              v-model:value="queryForm.level" ml="10"
              :options="Object.entries(formatLevel).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择严重程度"
            />
          </n-form-item-gi>
          <n-form-item-gi label="优先级">
            <n-select
              v-model:value="queryForm.priority" ml="10"
              :options="Object.entries(formatPriority).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择优先级"
            />
          </n-form-item-gi>
          <n-form-item-gi label="重复概率">
            <n-select
              v-model:value="queryForm.repeatedProbability" ml="10"
              :options="Object.entries(formatRepeatedProbability).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择重复概率"
            />
          </n-form-item-gi>
          <n-form-item-gi label="状态">
            <n-select
              v-model:value="queryForm.status" ml="10"
              :options="Object.entries(formatStatus).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择状态"
            />
          </n-form-item-gi>
          <n-form-item-gi label="类型">
            <n-select
              v-model:value="queryForm.type" ml="10"
              :options="Object.entries(formatType).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择类型"
            />
          </n-form-item-gi>
          <n-form-item-gi>
            <NButton ml="10" type="primary" @click="initTableData">
              搜索
            </NButton>
          </n-form-item-gi>
        </n-grid>
        <NButton
          ml="10" type="primary"
          @click="() => {
            editModalMode = 1
            editModal = {}
            showEditModal = true
          }"
        >
          + 新增
        </NButton>
      </n-form>
    </div>

    <n-data-table
      mt-20
      remote
      :columns="columns"
      :row-key="(row:RowData) => row.id"
      :data="tableData"
      :pagination="pagination"
      :scroll-x="1600"
      :loading="loading"
    />

    <n-modal v-model:show="showEditModal" :mask-closable="false">
      <n-card
        style="width: 600px" :title="editModalMode === 1 ? '新增' : '更新'" size="huge" role="dialog"
        aria-modal="true" closable @close="showEditModal = false"
      >
        <n-form ref="formRef" :model="editModal">
          <n-form-item path="title" label="缺陷标题">
            <n-input v-model:value="editModal.title" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="comment" label="缺陷描述">
            <n-input v-model:value="editModal.comment" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="level" label="严重程度">
            <n-select
              v-model:value="editModal.level"
              :options="Object.entries(formatLevel).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择严重程度"
            />
          </n-form-item>
          <n-form-item path="status" label="状态">
            <n-select
              v-model:value="editModal.status"
              :options="Object.entries(formatStatus).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择状态"
            />
          </n-form-item>
          <n-form-item path="type" label="类型">
            <n-select
              v-model:value="editModal.type"
              :options="Object.entries(formatType).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择类型"
            />
          </n-form-item>
          <n-form-item path="priority" label="优先级">
            <n-select
              v-model:value="editModal.priority"
              :options="Object.entries(formatPriority).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择优先级"
            />
          </n-form-item>
          <n-form-item path="repeatedProbability" label="重复概率">
            <n-select
              v-model:value="editModal.repeatedProbability"
              :options="Object.entries(formatRepeatedProbability).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择重复概率"
            />
          </n-form-item>
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <NButton :loading="loading" class="mr-4" @click="showEditModal = false">
                  取消
                </NButton>
                <NButton :loading="loading" type="primary" @click="handelSaveBtnClick">
                  保存
                </NButton>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </n-card>
    </n-modal>
  </n-card>
</template>

<style scoped lang="scss">

</style>
