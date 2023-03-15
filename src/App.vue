<script setup lang="ts">
import { dateZhCN, zhCN } from 'naive-ui'
import AppProvider from '@/components/common/AppProvider.vue'
</script>

<template>
  <n-config-provider h-full :locale="zhCN" :date-locale="dateZhCN">
    <AppProvider>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </AppProvider>
  </n-config-provider>
</template>
