<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import api from '@/views/testing/case/api'
import planApi from '@/views/testing/plan/api'
import userApi from '@/views/system/user/api'

import type { TestingPlanVo } from '@/views/testing/plan/type/response'
import type { TestingPlanSearchDto } from '@/views/testing/plan/type/request'
import type { TestingCaseVo } from '@/views/testing/case/type/response'
import type { UserVo } from '@/views/system/user/type/response'
import type { TestingCaseSearchDto } from '@/views/testing/case/type/request'

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
    label: user.username,
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
    label: user.username,
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

const handelSaveBtnClick = async () => {
  try {
    if (editModalMode.value === 1)
      await api.saveCase(editModal.value)
    else
      await api.updateCase(editModal.value)
    window.$message?.success('修改成功')
    showEditModal.value = false
    initTableData()
  }
  catch (e) {
    window.$message?.error('修改失败')
  }
}
const columns: DataTableColumns<RowData> = [
  { title: '用例编号', key: 'id', width: 60, ellipsis: { tooltip: true } },
  { title: '用例标题', key: 'name', width: 150, ellipsis: { tooltip: true } },
  { title: '用例备注', key: 'comment', width: 150, ellipsis: { tooltip: true } },
  { title: '测试计划', key: 'plantId', width: 150, ellipsis: { tooltip: true }, render: row => row.testingPlan?.name },
  { title: '输出者', key: 'userId', width: 150, ellipsis: { tooltip: true }, render: row => row.user?.name },
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
  <n-card h-full>
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
                  @input="(name) => {
                    userApi.searchUser({ name }).then((res) => {
                      searchUserResultInQuery = res.data.records ?? []
                    }).catch(e => {
                      searchUserResultInQuery = []
                    })
                    handleInput(name)
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

                  @input="(name) => {
                    planApi.searchPlan({ name }).then((res) => {
                      searchPlanResultInQuery = res.data.records ?? []
                    }).catch(e => {
                      searchPlanResultInQuery = []
                    })
                    handleInput(name)
                  }"
                />
              </template>
            </n-auto-complete>
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
      :scroll-x="1600"
      :loading="loading"
    />

    <n-modal v-model:show="showEditModal" :mask-closable="false">
      <n-card
        style="width: 600px" :title="editModalMode === 1 ? '新增' : '更新'" size="huge" role="dialog"
        aria-modal="true" closable @close="showEditModal = false"
      >
        <n-form ref="formRef" :model="editModal">
          <n-form-item path="title" label="用例标题">
            <n-input v-model:value="editModal.name" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="title" label="用例备注">
            <n-input v-model:value="editModal.comment" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="title" label="用例链接">
            <n-input v-model:value="editModal.link" @keydown.enter.prevent />
          </n-form-item>

          <n-form-item path="userId" label="输出者">
            <n-auto-complete
              v-model:value="selectedUserName" :options="autoCompleteUserOptions"
              @select="userSelected"
            >
              <template
                #default="{ handleInput, value: slotValue }"
              >
                <n-input
                  :value="slotValue"
                  placeholder="负责人"
                  @input="(name) => {
                    userApi.searchUser({ name }).then((res) => {
                      searchUserResult = res.data.records ?? []
                    }).catch(e => {
                      searchUserResult = []
                    })
                    handleInput(name)
                  }"
                />
              </template>
            </n-auto-complete>
          </n-form-item>

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
