import { login, logout, getInfo } from '@/api/user'
import { getToken, getClient, getUid, removeToken, removeClient, removeUid, setToken, setClient, setUid } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  client: getClient(),
  uid: getUid(),
  name: '',
  avatar: '',
  introduction: '',
  roles: ['admin']
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_CLIENT: (state, client) => {
    state.client = client
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { email, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password: password }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  setAuth({ commit }, auth) {
    return new Promise(resolve => {
      commit('SET_TOKEN', auth['access-token'])
      setToken(auth['access-token'])
      commit('SET_CLIENT', auth['client'])
      setClient(auth['client'])
      commit('SET_UID', auth['uid'])
      setUid(auth['uid'])
      resolve()
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        // commit('SET_ROLES', [])
        removeToken()
        commit('SET_CLIENT', '')
        removeClient()
        commit('SET_UID', '')
        removeUid()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      // commit('SET_ROLES', [])
      removeToken()
      commit('SET_CLIENT', '')
      removeClient()
      commit('SET_UID', '')
      removeUid()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      // const token = role + '-token'

      // commit('SET_TOKEN', token)
      // setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
