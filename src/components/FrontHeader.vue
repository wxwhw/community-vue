<template>
	<div class="nav">
		<div class="logo-box" style="height: 64px; line-height: 64px; text-align: center;">
			<img src="@/assets/cat.png" alt="" width="30" style="position: relative; top: 5px;">
			<span style="color: #313335; margin-left: 5px; font-size: 20px; font-weight: 400;">SakuraCat</span>
		</div>
		<div class="menu" v-if="!isMobile">
			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
				<el-menu-item index="/index">首页</el-menu-item>
				<el-menu-item index="/community">社区</el-menu-item>
				<el-submenu index="/tag">
					<template slot="title">标签</template>
					<el-submenu :show-timeout="100" :hide-timeout="100" :index="`/tag/${tagGroup.groupName}`"
						v-for="tagGroup in allTags"><template slot="title">{{ tagGroup.groupName
						}}</template>
						<el-menu-item :index="`/tag/${tagItem.id}`" v-for="tagItem in tagGroup.tagGroup">{{ tagItem.name
						}}</el-menu-item>

					</el-submenu>

				</el-submenu>
			</el-menu>
		</div>
		<div class="search">
			<el-input size="medium" placeholder="Search" v-model="searchText" prefix-icon="el-icon-search">
				<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
			</el-input>
		</div>


		<div class="login-button" v-if="!isLogin">
			<el-button size="medium" type="primary" @click="showLoginDialog = true">登录/注册</el-button>
		</div>

		<div class="message" v-if="isLogin">
			<el-link icon="el-icon-message" :underlin="false" href="/editor" target="_blank"></el-link>
		</div>
		<div class="user-info" v-if="!isMobile && isLogin">
			<el-dropdown size="medium" style="cursor: pointer; color: #000;display:flex;align-items: center;">
				<span class="el-dropdown-link" style="display: flex; align-items: center;">
					<img v-if="this.userInfo.avatar" class="user-avatar" :src="fullUrl" alt="">
					<img src="" alt="">
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item icon="el-icon-user" @click.native="toCenter">个人中心</el-dropdown-item>
					<el-dropdown-item icon="el-icon-s-promotion" divided @click.native="logout">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>

		<div class="mobile-menu" v-if="isMobile">
			<el-dropdown trigger="click" size="medium">
				<el-button style="border: none;">
					<i class="el-icon-more"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical" @select="handleSelect">
						<el-menu-item index="/article">文章</el-menu-item>
						<el-menu-item index="/editor">编辑器</el-menu-item>
						<el-menu-item index="3">动态</el-menu-item>
					</el-menu>
					<el-dropdown-item icon="el-icon-user" divided @click.native="center">个人中心</el-dropdown-item>
					<el-dropdown-item icon="el-icon-s-promotion" @click.native="logout">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>

		<!-- 登录模态框 -->
		<el-dialog :visible.sync="showLoginDialog" width="400px">
			<div class="login-box">
				<div class="login-main">
					<div class="head-box">
						<h1>SakuraCat</h1>
						<p>🚀邮箱登录</p>
					</div>
					<el-form :model="loginForm" status-icon :rules="rules" ref="loginForm">
						<el-form-item prop="email">
							<el-input v-model="loginForm.email" placeholder="邮箱" size="medium"></el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input v-model="loginForm.password" placeholder="密码" size="medium" show-password></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" icon="el-icon-unlock" @click="submitLogin('loginForm')"
								style="width: 100%; font-size: 14px;" size="medium">登入</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="login-footer">
					<el-button type="text" @click="showLoginDialog = false, showRegisterDialog = true">注册</el-button>
					<!-- <el-divider direction="vertical"></el-divider>
					<el-button type="text"
						@click="showLoginDialog = false, showRegisterDialog = false, showFgPwdDialog = true">忘记密码</el-button> -->
				</div>
			</div>
		</el-dialog>

		<!-- 注册模态框 -->
		<el-dialog :visible.sync="showRegisterDialog" width="400px">
			<div class="login-box">
				<div class="login-main">
					<div class="head-box">
						<h1>SakuraCat</h1>
						<p>🚀邮箱注册</p>
					</div>
					<el-form :model="registerForm" status-icon :rules="rules" ref="registerForm">
						<el-form-item prop="email">
							<el-input v-model="registerForm.email" placeholder="邮箱" size="medium"></el-input>
						</el-form-item>
						<el-form-item prop="nickname">
							<el-input v-model="registerForm.nickname" placeholder="昵称" size="medium"></el-input>
						</el-form-item>
						<el-form-item prop="Pwd">
							<el-input v-model="registerForm.Pwd" placeholder="密码" size="medium" show-password></el-input>
						</el-form-item>
						<el-form-item prop="repeatPwd">
							<el-input v-model="registerForm.repeatPwd" placeholder="确认密码" size="medium"
								show-password></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" icon="el-icon-unlock" @click="submitRegister('registerForm')"
								style="width: 100%; font-size: 14px;" size="medium">注册</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="login-footer">
					<el-button type="text" @click="showRegisterDialog = false, showLoginDialog = true">返回登录</el-button>
				</div>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import { bus } from '../utils/event-bus.js'
import Cookies from 'js-cookie'
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';
export default {
	created() {
		var token = Cookies.get('token')
		var isLogin = Cookies.get('isLogin')
		if (token && isLogin) {
			this.setLogin(true)
			this.token = token
			this.loadUserInfo(this.token)
		} else {
			this.setLogin(false)
		}
		this.loadAllTags()
	},
	computed: {
		...mapGetters(['isLogin']),
		fullUrl() {
			return `${this.baseUrl}${this.userInfo.avatar}`
		}
	},
	data() {
		return {
			token: '',
			userInfo: {},
			activeIndex: "/index",
			searchText: "",
			baseUrl: 'http://localhost:9505/',
			isMobile: false,
			showLoginDialog: false,
			showRegisterDialog: false,
			showFgPwdDialog: false,
			allTags: [],
			loginForm: {
				email: '',
				pwd: ''
			},
			registerForm: {
				email: '',
				nickname: '',
				Pwd: '',
				repeatPwd: ''
			},
			rules: {
				email: [
					{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
				],
				Pwd: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				],
				repeatPwd: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				],
				nickname: [
					{ required: true, message: '请输入昵称', trigger: 'blur' }
				]
			},
		};
	},
	methods: {
		...mapActions(['setLogin']),
		...mapActions(['setAdmin']),
		...mapActions(['setUser']),
		handleSelect(index) {
			this.activeIndex = index;
		},
		toCenter() {
			if (this.userInfo.id && this.$route.path !== `/user/${this.userInfo.id}`) {
				this.$router.push(`/user/${this.userInfo.id}`)
				if (this.$route.path === `/user/${this.userInfo.id}`) {
					this.$router.go(0)
				}
			} else if (!this.userInfo.id) {
				this.$router.replace('/404')
			} else {
				this.$router.go(0)
			}
		},
		logout() {
			// Logout functionality goes here
			Cookies.remove('token')
			Cookies.remove('isLogin')
			Cookies.remove('isAdmin')
			Cookies.remove('user_id')
			if (this.$route.path == '/index') {
				window.location.reload()
			} else {
				this.$router.push('/index')
			}
		},
		checkMobile() {
			this.isMobile = window.innerWidth <= 768;
		},
		submitLogin(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.request.post("http://localhost:9505/user/login", {
						email: this.loginForm.email,
						pwd: this.loginForm.password
					}, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => {
						if (res.code === 200) {
							this.$message({
								message: res.msg,
								type: 'success'
							})

							//设置cookie有效期七天
							Cookies.set('token', res.result.token, { expires: 7 })
							this.setLogin(true)
							this.setAdmin(res.result.isAdmin)
							
							Cookies.set('isAdmin', res.result.isAdmin, { expires: 7 })
							Cookies.set('isLogin', true, { expires: 7 })
							this.$router.go(0)
							this.showLoginDialog = false
						} else {
							this.$message({
								message: res.msg,
								type: 'error'
							})
						}
					})
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		submitRegister(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.request.post("http://localhost:9505/user/create", {
						email: this.registerForm.email,
						nickName: this.registerForm.nickname,
						Pwd: this.registerForm.Pwd,
						repeatPwd: this.registerForm.repeatPwd
					}, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => {
						if (res.code === 200) {
							this.$message({
								message: res.msg,
								type: 'success'
							})
							this.showRegisterDialog = false
						} else {
							this.$message({
								message: res.msg,
								type: 'error'
							})
						}
					})
				} else {
					return false;
				}
			});
		},
		loadUserInfo(token) {
			var userId = Cookies.get('user_id')
			this.request.get("/user/getUserByToken", { params: { token: token } }).then(res => {
				if (res.code == 200) {
					this.userInfo = res.result
					this.setUser(res.result)
					if (!userId) {
						Cookies.set('user_id', res.result.id, { expires: 7 })
					}
				}
			})
		},
		search() {
			if (this.searchText) {
				const currentRoute = this.$route.fullPath
				const newRoute = `/search?searchText=${this.searchText}`
				if (currentRoute !== newRoute) {
					this.$router.push(newRoute)
				} else {
					this.$router.go(0)
				}
			} else {
				this.$message.warning("请输入内容！")
			}

		},
		loadAllTags() {
			this.request.get("/tag/allTags").then(res => {

				if (res.code === 200) {
					this.allTags = res.result
				} else {
					this.$message.error("加载标签列表失败！")
				}
			})
		}
	},
	mounted() {
		bus.$on('showLoginBox', (msg) => {
			this.showLoginDialog = true
		})
		this.activeIndex = this.$route.path
		window.addEventListener("resize", this.checkMobile);
		this.checkMobile();
	},
	beforeDestroy() {
		window.removeEventListener("resize", this.checkMobile);
	}
};
</script>

<style scoped>
@media screen and (max-width: 768px) {
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		height: 64px;
		line-height: 64px;
		padding: 0 8px;
	}

	.search {
		margin: 0 auto;
	}

	.logo-box span {
		display: none;
	}
}

@media screen and (min-width: 768px) {
	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		height: 64px;
		line-height: 64px;
		padding: 0 70px;
	}

	.el-dialog__body {
		padding-top: 0;
		padding-bottom: 0;
	}

	.search {
		margin-right: 16px;
	}

	.logo-box {
		margin-right: 32px;
	}
}

.menu {
	display: flex;
	height: 64px;
	margin-right: auto;
}

.el-menu-demo {
	border: none;
}

.el-menu-item {
	font-size: 14px;
	font-weight: 500;
	height: 64px !important;
}

.search {
	width: 200px;
	height: 64px;
}

.message {
	height: 64px;
	line-height: 64px;
}

.message .el-link {
	line-height: 64px;
	font-size: 24px;
}

.user-info {
	margin-left: 16px;
	cursor: pointer;
}

.user-avatar {
	width: 30px;
	height: 30px;
	border-radius: 50%;
}

/* .mobile-menu {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	width: 100%;
	height: 100%;
}

.mobile-menu .el-dropdown-link {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
}

.mobile-menu .el-dropdown-menu {
	width: 100%;
	padding: 20px;
} */


.login-box {
	margin: 0 auto;
	border-radius: 5px;
	background-color: #fff;
}

.head-box h1 {
	text-align: center;
	font-weight: 600;
	font-size: 36px;
	line-height: 56px;
	color: #ffc0cb;
	margin-bottom: 4px;
}

.head-box p {
	color: #222224;
	font-size: 16px;
	font-weight: 600;
	line-height: 24px;
	text-align: center;
	margin-bottom: 16px;
}

.login-footer {
	display: flex;
	align-items: center;
	border-radius: 5px;
}

.login-main /deep/ .el-input__inner {
	background-color: #f5f6fa;
	border-color: #f5f6fa;
	font-size: 16px;
	font-weight: 400;
	color: #262626;
}

.login-main /deep/ .el-input__inner:focus {
	background-color: #e7eaf3;
}

.login-main /deep/ .el-input__inner::placeholder {
	color: #8c8c8c;
}
</style>
