<script setup lang="ts">
import type { DataTableColumns, FormInst, FormItemRule } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import type { FormRules } from 'naive-ui/es/form/src/interface'
import defectApi from '@/views/testing/defect/api'
import departmentApi from '@/views/system/department/api'
import userApi from '@/views/system/user/api'
import type { DefectVo } from '@/views/testing/defect/type/response'
import type { DepartmentVo } from '@/views/system/department/type/response'
import type { DefectSearchParam } from '@/views/testing/defect/type/request'
import { useUserStore } from '@/store'
import type { UserVo } from '@/views/system/user/type/response'

const editModalMode = ref<number>(1)
const tableData = ref<RowData[]>([])
const showEditModal = ref<boolean>(false)
const editModal = ref<DefectVo>({})
const loading = ref<boolean>(false)
const pagination = reactive<PaginationProps>({
  pageSize: 10,
})
const userInfo = useUserStore()
const isDev = userInfo.role[0] === 'dev'
const isMajor = userInfo.role[0] === 'major'
const isTest = userInfo.role[0] === 'test'
const selectedUserName = ref<string>('')
const searchUserResult = ref<UserVo[]>([])
const autoCompleteOptions = computed(() => searchUserResult.value?.map((user) => {
  return {
    label: user.name,
    value: user.id,
  }
}) ?? [])
const selected = (str: number) => {
  editModal.value.reportUserId = str
}

const selectedUserName2 = ref<string>('')
const searchUserResult2 = ref<UserVo[]>([])
const autoCompleteOptions2 = computed(() => searchUserResult2.value?.map((user) => {
  return {
    label: user.name,
    value: user.id,
  }
}) ?? [])
const selected2 = (str: number) => {
  editModal.value.userId = str
}

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

const formRef = ref<FormInst | null>(null)
const rules: FormRules = {
  title: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: string) => value === undefined || value === '' ? Promise.reject(Error('标题不能为空')) : true,
  },
  type: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value === undefined ? Promise.reject(Error('类型不能为空')) : true,
  },
  priority: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value === undefined ? Promise.reject(Error('优先级不能为空')) : true,
  },
  level: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value === undefined ? Promise.reject(Error('严重程度不能为空')) : true,
  },
  repeatedProbability: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value === undefined ? Promise.reject(Error('重复程度不能为空')) : true,
  },
  status: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value === undefined ? Promise.reject(Error('状态不能为空')) : true,
  },
  reportUserId: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value === undefined ? Promise.reject(Error('报告人不能为空')) : true,
  },
  userId: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value === undefined ? Promise.reject(Error('经办人不能为空')) : true,
  },
  description: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: string) => value === undefined || value === '' ? Promise.reject(Error('经办人不能为空')) : true,
  },

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
  { title: '缺陷编号', key: 'id', width: 120, ellipsis: { tooltip: true } },
  { title: '缺陷标题', key: 'title', width: 150, ellipsis: { tooltip: true } },
  {
    title: '缺陷类型',
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
    title: '报告人',
    key: 'reportUser',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => row.reportUser?.name ?? '-',
  },
  {
    title: '经办人',
    key: 'user',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => row.user?.name ?? '-',
  },
  { title: '缺陷描述', key: 'description', width: 150, ellipsis: { tooltip: true } },
  { title: '备注', key: 'comment', width: 150, ellipsis: { tooltip: true } },

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
              editModal.value = JSON.parse(JSON.stringify(row))
              showEditModal.value = true
            },
          },
          { default: () => '修改' },
        ),
      ]
    },
  },
]

const handelSaveBtnClick = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        if (editModalMode.value === 1)
          await defectApi.saveDefect(editModal.value)
        else
          await defectApi.updateDefect(editModal.value)
        window.$message?.success(editModalMode.value === 1 ? '新增成功' : '修改成功')
        showEditModal.value = false
        initTableData()
      }
      catch (e) {
        window.$message?.error(editModalMode.value === 1 ? '新增失败' : '修改失败')
      }
    }
  })
}

const departmentList = ref<DepartmentVo[]>([])
const getDepartmentList = async () => {
  const { data } = await departmentApi.searchDepartment({})
  departmentList.value = data?.records ?? []
}
getDepartmentList()
onMounted(() => {
  if (isDev)
    queryForm.value.userId = userInfo.userId
  else if (isMajor || isTest)
    queryForm.value.reportUserId = userInfo.userId
  initTableData()
  pagination.onUpdatePage = (page) => {
    pagination.page = page
    initTableData()
  }
})
</script>

<template>
  <n-card style="min-height: 100%">
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
            <NButton
              ml="10" type="primary" @click="() => {
                queryForm = {
                  title: '',
                  level: null,
                  priority: null,
                  repeatedProbability: null,
                  status: null,
                  type: null,
                }
                if (isDev)
                  queryForm.userId = userInfo.userId
                else if (isMajor || isTest)
                  queryForm.reportUserId = userInfo.userId
                initTableData()
              }"
            >
              重置
            </NButton>
          </n-form-item-gi>
        </n-grid>
        <NButton
          :disabled="isDev"
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
      :loading="loading"
      :scroll-x="1800"
    />

    <n-modal v-model:show="showEditModal" :mask-closable="false">
      <n-card
        style="width: 600px" :title="editModalMode === 1 ? '新增' : '更新'" size="huge" role="dialog"
        aria-modal="true" closable @close="showEditModal = false"
      >
        <n-form ref="formRef" :model="editModal" :rules="rules">
          <n-form-item path="title" label="缺陷标题">
            <n-input v-model:value="editModal.title" :disabled="isDev" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="type" label="类型">
            <n-select
              v-model:value="editModal.type"
              :disabled="isDev"
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
              :disabled="isDev"
              :options="Object.entries(formatPriority).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择优先级"
            />
          </n-form-item>
          <n-form-item path="level" label="严重程度">
            <n-select
              v-model:value="editModal.level"
              :disabled="isDev"
              :options="Object.entries(formatLevel).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择严重程度"
            />
          </n-form-item>
          <n-form-item path="repeatedProbability" label="重复概率">
            <n-select
              v-model:value="editModal.repeatedProbability"
              :disabled="isDev"
              :options="Object.entries(formatRepeatedProbability).map(level => ({
                label: level[1].label,
                value: level[0],
              }))"
              placeholder="请选择重复概率"
            />
          </n-form-item>
          <n-form-item path="userId" label="报告人">
            <n-auto-complete
              v-model:value="selectedUserName" :options="autoCompleteOptions"
              @select="selected"
            >
              <template
                #default="{ handleInput, value: slotValue }"
              >
                <n-input
                  :disabled="isDev"
                  :value="slotValue"
                  placeholder="报告人"
                  @focus="(event) => {
                    userApi.searchUser({ name: '' }).then((res) => {
                      searchUserResult = res.data.records ?? []
                    }).catch(e => {
                      searchUserResult = []
                    })
                    handleInput(' ')
                  }"
                  @input="(name) => {
                    userApi.searchUser({ name: name.trimStart() }).then((res) => {
                      searchUserResult = res.data.records ?? []
                    }).catch(e => {
                      searchUserResult = []
                    })
                    handleInput(name.trimStart())
                  }"
                />
              </template>
            </n-auto-complete>
          </n-form-item>
          <n-form-item path="userId" label="经办人">
            <n-auto-complete
              v-model:value="selectedUserName2" :options="autoCompleteOptions2"
              @select="selected2"
            >
              <template
                #default="{ handleInput, value: slotValue }"
              >
                <n-input
                  :disabled="isDev"
                  :value="slotValue"
                  placeholder="经办人"
                  @focus="(event) => {
                    userApi.searchUser({ name: '' }).then((res) => {
                      searchUserResult2 = res.data.records ?? []
                    }).catch(e => {
                      searchUserResult2 = []
                    })
                    handleInput(' ')
                  }"
                  @input="(name) => {
                    userApi.searchUser({ name: name.trimStart() }).then((res) => {
                      searchUserResult2 = res.data.records ?? []
                    }).catch(e => {
                      searchUserResult2 = []
                    })
                    handleInput(name.trimStart())
                  }"
                />
              </template>
            </n-auto-complete>
          </n-form-item>
          <n-form-item path="description" label="描述">
            <n-input v-model:value="editModal.description" :disabled="isDev" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="comment" label="备注">
            <n-input v-model:value="editModal.comment" :disabled="isDev" @keydown.enter.prevent />
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
