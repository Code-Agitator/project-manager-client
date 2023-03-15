<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NSwitch } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import { renderIcon, timeFormat } from '@/utils/common'
import api from '@/views/system/department/api'
import type { UserVo } from '@/views/system/user/type/response'
import type { UserSearchParam } from '@/views/system/user/type/request'
import type { DepartmentSearchParam } from '@/views/system/department/type/request'
import type { DepartmentVo } from '@/views/system/department/type/response'

const modalForm = ref<DepartmentSearchParam>({})
const tableData = ref<RowData[]>([])
const showEditModal = ref<boolean>(false)
const editModal = ref<DepartmentVo>({})
const loading = ref<boolean>(false)
const pagination = reactive<PaginationProps>({
  pageSize: 10,
})

interface RowData extends DepartmentVo {

}

const columns: DataTableColumns<RowData> = [
  { title: '部门编号', key: 'id', width: 60, ellipsis: { tooltip: true } },
  { title: '部门名称', key: 'name', width: 150, ellipsis: { tooltip: true } },
  { title: '主管工号', key: 'userId', render: row => row.user?.no, width: 150, ellipsis: { tooltip: true } },
  { title: '主管名称', key: 'userId', render: row => row.user?.username, width: 150, ellipsis: { tooltip: true } },

]
const queryForm = ref<UserSearchParam>({})

const initTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  api.searchDepartment({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => loading.value = false)
}

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
        <n-grid :cols="4" :x-gap="24">
          <n-form-item-gi
            path="keywords"
            label="部门名称"
          >
            <n-input v-model:value="queryForm.keywords" />
          </n-form-item-gi>
        </n-grid>
        <n-form-item float-right>
          <NButton type="primary" @click="initTableData">
            搜索
          </NButton>
        </n-form-item>
        <n-form-item float-right>
          <NButton type="primary" @click="showEditModal = true;">
            新增
          </NButton>
        </n-form-item>
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
        <n-form ref="formRef" :model="model">
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi :span="12" path="name" label="名称">
              <n-input v-model:value="model.name" @keydown.enter.prevent />
            </n-form-item-gi>
            <n-form-item-gi :span="12" path="age" label="年龄">
              <n-input-number v-model:value="model.age" class="w-100" :show-button="false" @keydown.enter.prevent />
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi :span="12" path="phone" label="联系电话">
              <n-input v-model:value="model.phone" @keydown.enter.prevent />
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi :span="10" label="详细地址">
              <n-cascader
                v-model:value="model.areaCode"
                placeholder="选择地址"
                :options="options"
                check-strategy="child"
                :show-path="true"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="14">
              <n-input v-model:value="model.address" @keydown.enter.prevent />
            </n-form-item-gi>
          </n-grid>
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
