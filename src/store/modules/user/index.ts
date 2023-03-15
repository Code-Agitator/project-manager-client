import { defineStore } from 'pinia'
import { removeToken } from '@/utils/auth/token'
import { toLogin } from '@/utils/auth/router'
import api from '@/api'

interface UserInfo {
  id?: number|string
  name?: string
  avatar?: string
  role?: Array<string>
}

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: <UserInfo> {},
    }
  },
  getters: {
    userId(): string {
      return <string>this.userInfo.id || ''
    },
    name(): string {
      return this.userInfo.name || ''
    },
    avatar(): string {
      return this.userInfo.avatar || ''
    },
    role(): Array<string> {
      return this.userInfo.role || []
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res = await api.getUser()
        if (res.code === 200) {

          res.data && (this.userInfo = { id:res.data?.userId, name:res.data?.username, avatar:res.data?.avgPath, role:['admin'] })
          return Promise.resolve(res.data)
        }
        else {
          return Promise.reject(res)
        }
      }
      catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      removeToken()
      this.userInfo = {}
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
