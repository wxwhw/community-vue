import Vue from 'vue'
import Vuex from 'vuex'
import request from './request'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isLogin: false,
		isAdmin: false,
		loginUserInfo: {}
	},
	mutations: {
		setIsLogin(state, isLogin) {
			state.isLogin = isLogin
		},
		setIsAdmin(state, isAdmin) {
			state.isAdmin = isAdmin
		},
		setLoginUser(state, loginUserInfo) {
			state.loginUserInfo = loginUserInfo
		  }
	},
	actions: {
		setLogin({ commit }, isLogin) {
			commit('setIsLogin', isLogin)
		},
		setAdmin({ commit }, isAdmin) {
			commit('setIsAdmin', isAdmin)
		},
		setUser({commit} ,user){
			commit('setLoginUser', user)
		}
	},
	getters: {
		isAdmin: state => state.isAdmin,
		isLogin: state => state.isLogin,
		loginUserInfo: state => state.loginUserInfo
	}
})

export default store
