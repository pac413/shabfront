import type { ActionTree } from 'vuex'

import { confirmEmail, deleteMyAccount, updateAccountEmail, updateAccountPassword } from '@/graphql/mutations'
import { post } from '@/plugins/axios'
import { mutateApollo } from '@/plugins/vue-apollo'
import type { RootState } from '@/store/types'

import { login } from './actions/login'
import { loginRedirect } from './actions/loginRedirect'
import { loginWithToken } from './actions/loginWithToken'
import { logout } from './actions/logout'
import { signup } from './actions/signup'
import type { AuthState } from './types'

const actions: ActionTree<AuthState, RootState> = {
  login,
  loginRedirect,
  loginWithToken,
  logout,
  signup,

  async confirmEmail({ commit }, params: { token: string }) {
    try {
      const response = await mutateApollo({
        mutation: confirmEmail,

        variables: {
          token: params.token,
        },
      })
      if (response.data.confirmEmail.success) {
        commit('SET_AUTHENTICATED_EMAIL_CONFIRMED', true)
      }

      return response.data.confirmEmail
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      }
    }
  },

  resetPassword(_, params: { email: string }) {
    return post(import.meta.env.VITE_APP_REST_API + '/auth/reset-password', {
      email: params.email,
    })
  },

  setNewPassword(_, params: { password: string; token: string }) {
    return post(import.meta.env.VITE_APP_REST_API + '/auth/set-password', {
      password: params.password,
      token: params.token,
    })
  },

  checkLink(_, params: { type: string; token: string }) {
    return post(import.meta.env.VITE_APP_REST_API + '/auth/check-link', {
      type: params.type,
      token: params.token,
    })
  },

  async updateEmail(_, payload: { email: string }) {
    const { data } = await mutateApollo({
      mutation: updateAccountEmail,
      variables: {
        email: payload.email,
      },
    })
    return data.updateAccountEmail
  },

  async changePassword(_, payload: { password: string }) {
    const { data } = await mutateApollo({
      mutation: updateAccountPassword,
      variables: {
        password: payload.password,
      },
    })
    return data.updateAccountPassword
  },

  async deleteUserAccount() {
    const { data } = await mutateApollo({
      mutation: deleteMyAccount,
    })
    return data.deleteMyAccount
  },

  restoreAccount(_, params: { password: string; email: string }) {
    return post(import.meta.env.VITE_APP_REST_API + '/auth/restore-account', {
      username: params.email,
      password: params.password,
    })
      .then((response) => response.data)
      .catch((error) => error.response.data)
  },
}

export default actions
