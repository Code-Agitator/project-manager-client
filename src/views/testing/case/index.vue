<script setup lang="ts">
import type { DataTableColumns, FormInst, FormItemRule } from 'naive-ui'
import { NButton } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import type { FormRules } from 'naive-ui/es/form/src/interface'
import api from '@/views/testing/case/api'
import planApi from '@/views/testing/plan/api'
import userApi from '@/views/system/user/api'

import type { TestingPlanVo } from '@/views/testing/plan/type/response'
import type { TestingCaseVo } from '@/views/testing/case/type/response'
import type { UserVo } from '@/views/system/user/type/response'
import type { TestingCaseSearchDto } from '@/views/testing/case/type/request'
import { useUserStore } from '@/store'

const editModalMode = ref<number>(1)
const tableData = ref<RowData[]>([])
const showEditModal = ref<boolean>(false)
const editModal = ref<TestingCaseVo>({})
const loading = ref<boolean>(false)
const pagination = reactive<PaginationProps>({
  pageSize: 10,
})
const queryForm = ref<TestingCaseSearchDto>({})
const selectedUserName = ref<string>('')
const searchUserResult = ref<UserVo[]>([])
const autoCompleteUserOptions = computed(() => searchUserResult.value?.map((user) => {
  return {
    label: user.name,
    value: user.id,
  }
}) ?? [])
const userSelected = (str: number) => {
  editModal.value.userId = str
}

const selectedPlanName = ref<string>('')
const searchPlanResult = ref<TestingPlanVo[]>([])
const autoCompletePlanOptions = computed(() => searchPlanResult.value?.map((plan) => {
  return {
    label: plan.name,
    value: plan.id,
  }
}) ?? [])
const planSelected = (str: number) => {
  editModal.value.plantId = str
}

const selectedPlanNameInQuery = ref<string>('')
const searchPlanResultInQuery = ref<TestingPlanVo[]>([])
const autoCompletePlanOptionsInQuery = computed(() => searchPlanResultInQuery.value?.map((plan) => {
  return {
    label: plan.name,
    value: plan.id,
  }
}) ?? [])
const planSelectedInQuery = (str: number) => {
  queryForm.value.plantId = str
}

const selectedUserNameInQuery = ref<string>('')
const searchUserResultInQuery = ref<UserVo[]>([])
const autoCompleteOptionsInQuery = computed(() => searchUserResultInQuery.value?.map((user) => {
  return {
    label: user.name,
    value: user.id,
  }
}) ?? [])
const selectedInQuery = (str: number) => {
  queryForm.value.userId = str
}

interface RowData extends TestingCaseVo {
}
const initTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  api.searchCase({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => { loading.value = false })
}
const rules: FormRules = {
  link: { required: true, trigger: ['input', 'blur'], validator: (rule: FormItemRule, value?: string) => value === undefined || value === '' ? Promise.reject(Error('链接不能为空')) : true },
  name: { required: true, trigger: ['input', 'blur'], validator: (rule: FormItemRule, value?: string) => value === undefined || value === '' ? Promise.reject(Error('名称不能为空')) : true },
  plantId: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value === undefined ? Promise.reject(Error('测试计划不能为空')) : true,
  },
}

const handleDeletePlan = async (id?: number) => {
  if (id === undefined)
    return
  try {
    await api.deleteCase(id)
    window.$message?.success('删除成功')
    initTableData()
  }
  catch (e) {
    window.$message?.error('删除失败')
  }
}

const userStore = useUserStore()
const formRef = ref<FormInst | null>(null)

const handelSaveBtnClick = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        if (editModalMode.value === 1)
          (editModal.value.userId = userStore.userInfo.id) && await api.saveCase(editModal.value)
        else
          await api.updateCase(editModal.value)
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
const columns: DataTableColumns<RowData> = [
  { title: '用例编号', key: 'id', ellipsis: { tooltip: true } },
  { title: '测试计划', key: 'plantId', ellipsis: { tooltip: true }, render: row => row.testingPlan?.name },
  { title: '用例标题', key: 'name', ellipsis: { tooltip: true } },
  { title: '输出者', key: 'userId', ellipsis: { tooltip: true }, render: row => row.user?.name },
  { title: '用例链接', key: 'link', ellipsis: { tooltip: true } },
  { title: '测试结果', key: 'result', ellipsis: { tooltip: true } },
  { title: '用例备注', key: 'comment', ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 150,
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
              row.user?.name && (selectedUserName.value = row.user.name)
              row.testingPlan?.name && (selectedPlanName.value = row.testingPlan.name)
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
            onClick: () => handleDeletePlan(row.id),
          },
          { default: () => '删除' },
        ),
      ]
    },
  },
]

onMounted(() => {
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
          <n-form-item-gi label="用例标题">
            <n-input v-model:value="queryForm.name" />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-auto-complete
              v-model:value="selectedUserNameInQuery" :options="autoCompleteOptionsInQuery"
              @select="selectedInQuery"
            >
              <template
                #default="{ handleInput, value: slotValue }"
              >
                <n-input
                  :value="slotValue"
                  placeholder="输出者"
                  @focus="() => {
                    userApi.searchUser({ name: '' }).then((res) => {
                      searchUserResultInQuery = res.data.records ?? []
                    }).catch(e => {
                      searchUserResultInQuery = []
                    })
                    handleInput(' ')
                  }"
                  @input="(name) => {
                    userApi.searchUser({ name: name.trimStart() }).then((res) => {
                      searchUserResultInQuery = res.data.records ?? []
                    }).catch(e => {
                      searchUserResultInQuery = []
                    })
                    handleInput(name.trimStart())
                  }"
                />
              </template>
            </n-auto-complete>
          </n-form-item-gi>
          <n-form-item-gi>
            <n-auto-complete
              v-model:value="selectedPlanNameInQuery"
              :options="autoCompletePlanOptionsInQuery"
              @select="planSelectedInQuery"
            >
              <template
                #default="{ handleInput, value: slotValue }"
              >
                <n-input
                  :value="slotValue"
                  placeholder="测试计划"
                  @focus="() => {
                    planApi.searchPlan({ name: ' ' }).then((res) => {
                      searchPlanResultInQuery = res.data.records ?? []
                    }).catch(e => {
                      searchPlanResultInQuery = []
                    })
                    handleInput(' ')
                  }"
                  @input="(name) => {
                    planApi.searchPlan({ name: name.trimStart() }).then((res) => {
                      searchPlanResultInQuery = res.data.records ?? []
                    }).catch(e => {
                      searchPlanResultInQuery = []
                    })
                    handleInput(name.trimStart())
                  }"
                />
              </template>
            </n-auto-complete>
          </n-form-item-gi>

          <n-form-item-gi>
            <NButton ml="10" type="primary" @click="initTableData">
              搜索
            </NButton>
            <NButton
              ml="10" type="primary" @click="() => {
                selectedPlanNameInQuery = null
                selectedUserNameInQuery = null
                queryForm = {
                  plantId: '',
                  userId: '',
                  name: '',
                }
                initTableData()
              }"
            >
              重置
            </NButton>
          </n-form-item-gi>
        </n-grid>
        <NButton
          ml="10" type="primary"
          @click="() => {
            editModalMode = 1
            editModal = {}
            showEditModal = true
            selectedUserName = ''
            selectedPlanName = ''
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
    />

    <n-modal v-model:show="showEditModal" :mask-closable="false">
      <n-card
        style="width: 600px" :title="editModalMode === 1 ? '新增' : '更新'" size="huge" role="dialog"
        aria-modal="true" closable @close="showEditModal = false"
      >
        <n-form ref="formRef" :model="editModal" :rules="rules">
          <n-form-item path="plantId" label="用例计划">
            <n-auto-complete
              v-model:value="selectedPlanName" :options="autoCompletePlanOptions"
              @select="planSelected"
            >
              <template
                #default="{ handleInput, value: slotValue }"
              >
                <n-input
                  :value="slotValue"
                  placeholder="请选择"
                  @focus="() => {
                    planApi.searchPlan({ name: ' ' }).then((res) => {
                      searchPlanResult = res.data.records ?? []
                    }).catch(e => {
                      searchPlanResult = []
                    })
                    handleInput(' ')
                  }"
                  @input="(name) => {
                    planApi.searchPlan({ name }).then((res) => {
                      searchPlanResult = res.data.records ?? []
                    }).catch(e => {
                      searchPlanResult = []
                    })
                    handleInput(name)
                  }"
                />
              </template>
            </n-auto-complete>
          </n-form-item>

          <n-form-item path="name" label="用例标题">
            <n-input v-model:value="editModal.name" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="link" label="用例链接">
            <n-input v-model:value="editModal.link" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="title" label="测试结果">
            <n-select v-model:value="editModal.result" :options="[{ label: 'PASS', value: 'PASS' }, { label: 'FAIL', value: 'FAIL' }]" />
          </n-form-item>
          <n-form-item path="comment" label="用例备注">
            <n-input v-model:value="editModal.comment" @keydown.enter.prevent />
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
