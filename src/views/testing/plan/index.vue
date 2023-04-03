<script setup lang="ts">
import type { DataTableColumns, FormInst, UploadFileInfo } from 'naive-ui'
import { NButton } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import { h } from 'vue'
import api from '@/views/testing/plan/api'
import userApi from '@/views/system/user/api'
import type { TestingPlanVo } from '@/views/testing/plan/type/response'
import type { TestingPlanSearchDto } from '@/views/testing/plan/type/request'
import type { UserVo } from '@/views/system/user/type/response'
import { useUserStore } from '@/store'
import defectApi from '@/views/testing/defect/api'

const editModalMode = ref<number>(1)
const tableData = ref<RowData[]>([])
const showEditModal = ref<boolean>(false)
const editModal = ref<TestingPlanVo>({})
const loading = ref<boolean>(false)
const selectedUserName = ref<string>('')
const searchUserResult = ref<UserVo[]>([])
const userInfo = useUserStore()
const autoCompleteOptions = computed(() => searchUserResult.value?.map((user) => {
  return {
    label: user.name,
    value: user.id,
  }
}) ?? [])
const selectedUserNameInQuery = ref<string>('')
const fileList = ref<UploadFileInfo[]>([])
const searchUserResultInQuery = ref<UserVo[]>([])
const autoCompleteOptionsInQuery = computed(() => searchUserResultInQuery.value?.map((user) => {
  return {
    label: user.name,
    value: user.id,
  }
}) ?? [])
const pagination = reactive<PaginationProps>({
  pageSize: 10,
})
const queryForm = ref<TestingPlanSearchDto>({})
interface RowData extends TestingPlanVo {
}
const initTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  api.searchPlan({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => { loading.value = false })
}
const selected = (str: number) => {
  editModal.value.userId = str
}
const selectedInQuery = (str: number) => {
  queryForm.value.userId = str
}

const handleDeletePlan = async (id?: number) => {
  if (id === undefined)
    return
  try {
    await api.deletePlan(id)
    window.$message?.success('删除成功')
    initTableData()
  }
  catch (e) {
    window.$message?.error('删除失败')
  }
}
const formRef = ref<FormInst | null>(null)
const handelSaveBtnClick = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        if (editModalMode.value === 1)
          await api.savePlan(editModal.value)
        else
          await api.updatePlan(editModal.value)
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
  { title: '计划编号', key: 'id', width: 60, ellipsis: { tooltip: true } },
  { title: '计划名称', key: 'name', width: 150, ellipsis: { tooltip: true } },
  {
    title: '测试计划链接',
    key: 'link',
    width: 150,
    ellipsis: { tooltip: true },
    render: (row) => {
      return row.link ? h('a', { href: `http://localhost:8880/service/testing/plan/download?fileName=${row.link}`, style: { color: 'blue' } }, row.link) : '没有上传文件'
    },
  },
  { title: '负责人', key: 'userId', width: 150, ellipsis: { tooltip: true }, render: row => row.user?.name },
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
            disabled: !(userInfo.role[0] === 'admin' || userInfo.role[0] === 'major'),
            onClick: () => {
              editModalMode.value = 2
              editModal.value = JSON.parse(JSON.stringify(row))
              showEditModal.value = true
              row.user?.name && (selectedUserName.value = row.user.name)
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
            disabled: !(userInfo.role[0] === 'admin' || userInfo.role[0] === 'major'),

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
          <n-form-item-gi label="计划名称">
            <n-input v-model:value="queryForm.name" />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-date-picker
              v-model:value="queryForm.startTime" ml="10" type="datetime"
              placeholder="请选择开始时间"
              clearable
              @confirm="(startDate) => {
                queryForm.startDate = startDate
              }"
            />
            <n-date-picker
              v-model:value="queryForm.endTime" ml="10" type="datetime"
              placeholder="请选择结束时间"
              clearable
              @confirm="(endDate) => {
                queryForm.endDate = endDate
              }"
            />
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
                  placeholder="负责人"
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
            <NButton ml="10" type="primary" @click="initTableData">
              搜索
            </NButton>
            <NButton
              ml="10" type="primary" @click="() => {
                selectedUserNameInQuery = null
                queryForm = {
                  name: undefined,
                  userId: undefined,
                  startTime: undefined,
                  endTime: undefined,
                }
              }"
            >
              重置
            </NButton>
          </n-form-item-gi>
        </n-grid>
        <NButton
          :disabled="!(userInfo.role[0] === 'admin' || userInfo.role[0] === 'major')"
          ml="10" type="primary"
          @click="() => {
            editModalMode = 1
            editModal = {}
            showEditModal = true
            selectedUserName = ''
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
        <n-form
          ref="formRef" :model="editModal"
        >
          <n-form-item path="title" label="计划名称">
            <n-input v-model:value="editModal.name" @keydown.enter.prevent />
          </n-form-item>
          <n-upload
            action="/service/testing/plan/upload"
            :max="1"
            @finish="({ file }) => {
              editModal.link = file.name
            }"
          >
            <NButton>上传文件</NButton>
          </n-upload>
          <n-form-item path="userId" label="负责人">
            <n-auto-complete
              v-model:value="selectedUserName" :options="autoCompleteOptions"
              @select="selected"
            >
              <template
                #default="{ handleInput, value: slotValue }"
              >
                <n-input
                  :value="slotValue"
                  placeholder="负责人"
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
