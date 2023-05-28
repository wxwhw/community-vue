<template>
	<div class="main">
		<el-container>
			<el-header>
				<FrontHeader></FrontHeader>
			</el-header>

			<el-main>
				<div class="main-box">
					<div class="profile-header">
						<div class="profileHeader-wraper">
							<div class="user-box">
								<img :src="serverUrl + userInfo.avatar" alt="User Avatar" v-if="userInfo.avatar != ''">
								<div class="user-info">
									<div class="user-name">
										<p>{{ userInfo.nickname }}</p>
									</div>
									<div class="user-signature">
										<p>{{ userInfo.signature }}</p>
									</div>
								</div>
								<div class="action">

									<el-popconfirm title="确认取消关注吗?😔" @confirm="cancelFollow" v-if="this.userIsFollow">
										<el-button icon="el-icon-check" slot="reference" v-if="this.userIsFollow">已关注</el-button>
									</el-popconfirm>
									<el-button icon="el-icon-plus" type="primary" @click="followUser(userInfo.id)"
										v-if="!this.userIsFollow">关注</el-button>
									<el-button icon="el-icon-setting" v-if="this.loginUserInfo.id == this.userId"
										@click="dialogVisible = true"></el-button>
								</div>
							</div>
						</div>
					</div>
					<div class="profile-main">
						<div class="profile-left">
							<el-tabs v-model="activeTab" @tab-click="handleClick">
								<el-tab-pane label="全部文章" name="first">
									<UserArticleList :audit="true" :userId="this.userId" v-if="activeTab === 'first'"></UserArticleList>
								</el-tab-pane>
								<el-tab-pane label="投稿" name="second">
									<UserArticleList :audit="false" :userId="this.userId" v-if="activeTab === 'second'"></UserArticleList>
								</el-tab-pane>
								<el-tab-pane label="收藏" name="fourth">
									<UserCollectArticleList :userId="this.userId" v-if="activeTab === 'fourth'"></UserCollectArticleList>
								</el-tab-pane>

							</el-tabs>
						</div>
						<div class="profile-right">
							<el-card shadow="never">
								<div slot="header" class="clearfix">
									<span>关注列表</span>
									<el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
								</div>
								<div v-for="user in followUserList" :key="user.id" class="follow-list">
									<div class="follow-user-item">
										<a href="#" class="item-box">
											<div class="avatar">
												<img :src="serverUrl + user.avatar" alt="" v-if="user.avatar != ''">
											</div>
											<div class="username">
												<a :href="`/user/${user.id}`" target="_blank">{{ user.nickname }}</a>
											</div>
										</a>
									</div>
								</div>
							</el-card>

							<el-card shadow="never">
								<div slot="header" class="clearfix">
									<span>粉丝</span>
									<el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
								</div>
								<div v-for="user in fansList" :key="user.id" class="follow-list">
									<div class="follow-user-item">
										<a href="#">
											<div class="avatar">
												<img :src="serverUrl + user.avatar" alt="">
											</div>
											<div class="username">
												<a :href="`/user/${user.id}`" target="_blank">{{ user.nickname }}</a>
											</div>
										</a>
									</div>
								</div>
							</el-card>
						</div>
					</div>
				</div>
			</el-main>
		</el-container>

		<el-dialog title="个人资料" :visible.sync="dialogVisible" width="400px">
			<el-tabs v-model="activeTab2">
				<el-tab-pane label="基本信息" name="userInfo">

					<el-upload class="avatar-uploader" action="http://localhost:9505/upload/uploadImg" :show-file-list="false" :on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload" style="text-align: center; margin-bottom: 16px;">
						<img v-if="userForm.avatar" :src="`http://localhost:9505/${userForm.avatar}`" class="avatar" style="width: 88px; height: 88px; border-radius: 50%;">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>

					<el-form ref="userForm" :model="userForm" label-width="80px" :rules="rules">
						<el-form-item label="用户昵称" prop="nickname">
							<el-input v-model="userForm.nickname" placeholder="请输入用户昵称..."></el-input>
						</el-form-item>
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="userForm.email" placeholder="请输入邮箱..."></el-input>
						</el-form-item>

						<el-form-item label="个人简介" prop="signature">
							<el-input type="textarea" v-model="userForm.signature" placeholder="请输入个人简介..."></el-input>
						</el-form-item>

						<el-form-item label="性别">
							<el-radio-group v-model="userForm.gender">
								<el-radio v-model="userForm.gender" label="男"></el-radio>
								<el-radio v-model="userForm.gender" label="女"></el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item label="状态">
							<el-tag type="success">
								<span v-if="userForm.state == 'Enable'">正常</span>
								<span v-if="userForm.state == 'Unable'">停用</span>
							</el-tag>
						</el-form-item>

						<el-form-item label="创建日期">
							<p>{{ userForm.createAt }}</p>
						</el-form-item>

						<el-form-item label="上次登录">
							<p>{{ userForm.lastLoginTime }}</p>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="saveUser('userForm')">保存</el-button>
							<el-button @click="dialogVisible = false">取消</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="修改密码" name="changePwd">
					<el-form ref="pwdForm" :model="pwdForm" label-width="80px">
						<el-form-item label="旧密码">
							<el-input v-model="pwdForm.oldPwd" placeholder="请输入旧密码..." show-password></el-input>
						</el-form-item>

						<el-form-item label="新密码">
							<el-input v-model="pwdForm.newPwd" placeholder="请输入新密码..." show-password></el-input>
						</el-form-item>

						<el-form-item label="确认密码">
							<el-input v-model="pwdForm.repeatPwd" placeholder="请确认新密码..." show-password></el-input>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" @click="changePwd">确认修改</el-button>
							<el-button @click="dialogVisible = false">取消</el-button>
						</el-form-item>

					</el-form>
				</el-tab-pane>
			</el-tabs>


		</el-dialog>
	</div>
</template>

<script>
import Cookies from 'js-cookie';
import { mapState } from 'vuex';
import FrontHeader from '@/components/FrontHeader.vue';
import UserArticleList from '@/components/UserArticleList.vue';
import UserCollectArticleList from '@/components/UserCollectArticleList.vue'
export default {

	created() {
		var userId = this.$route.params.id
		this.userId = userId
		this.loadUserInfo(userId)
		this.getFollowUser(userId)
		this.getFans(userId)
		this.$watch('loginUserInfo', (newVal, oldVal) => {
			this.checkUserIsFollow(userId, newVal.id)
		})
	},
	components: {
		FrontHeader,
		UserArticleList,
		UserCollectArticleList
	},
	computed: {
		...mapState(['loginUserInfo'])
	},
	data() {
		return {
			activeTab: 'first',
			activeTab2: 'userInfo',
			userId: null,
			userInfo: {},
			serverUrl: 'http://localhost:9505/',
			followUserList: [],
			followUserForm: {},
			userIsFollow: false,
			fansList: [],
			dialogVisible: false,
			userForm: {},
			pwdForm: {},
			rules: {
				nickname: [
					{ required: true, message: '请输入用户名称', trigger: 'blur' },
					{ min: 3, message: '长度大于3个字符', trigger: 'blur' }
				],
				email: [
					{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
				],
			},
		}
	},
	methods: {
		loadUserInfo(useId) {
			this.request.get(`http://localhost:9505/user/${useId}`).then(res => {
				if (res.code === 200) {
					this.userInfo = res.result
					this.userForm = res.result
				} else if (res.result == null) {
					this.$router.replace('/404')
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		handleClick(tab, event) {

		},
		getFollowUser(userId) {
			this.request.get("http://localhost:9505/follow/myfollowList", {
				params: {
					userId: userId,
					followType: 'User',
					pageNum: 1,
					pageSize: 5
				}
			}).then(res => {
				if (res.code === 200) {
					this.followUserList = res.result;
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		getFans(userId) {
			this.request.get("http://localhost:9505/follow/fansList", {
				params: {
					userId: userId,
					followType: 'User',
					pageNum: 1,
					pageSize: 5
				}
			}).then(res => {
				if (res.code === 200) {
					this.fansList = res.result;
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		followUser(followedId) {
			this.followUserForm.followed = followedId
			this.followUserForm.followType = 'User'
			this.followUserForm.userId = this.loginUserInfo.id
			if (followedId === this.loginUserInfo.id) {
				this.$message.error("你不能关注自己哦~😢")
			} else {
				this.request.post("http://localhost:9505/follow/user", this.followUserForm).then(res => {
					if (res.code === 200) {
						this.$message.success(res.msg)
						this.checkUserIsFollow(this.userId, this.loginUserInfo.id)
					} else {
						this.$message.error(res.msg)
					}
				})
			}
		},
		checkUserIsFollow(followedId, userId) {
			this.request.get("http://localhost:9505/follow/checkUserIsFollow", {
				params: {
					followed: followedId,
					userId: userId
				}
			}).then(res => {
				if (res.code === 200) {
					this.userIsFollow = res.result.isFollow
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		cancelFollow() {
			var FollowForm = {
				followed: this.userId,
				userId: this.loginUserInfo.id,
				followType: 'User'
			}
			this.request.post("http://localhost:9505/follow/cancelFollow", FollowForm).then(res => {
				if (res.code === 200) {
					this.$message.success(res.msg)
					this.checkUserIsFollow(this.userId, this.loginUserInfo.id)
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		saveUser(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.request.post("http://localhost:9505/user/save", this.userForm).then(res => {
						if (res.code == 200) {
							this.$message({
								message: res.msg,
								type: 'success'
							})
							this.loadUserInfo(this.userId)
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
		changePwd() {
			this.pwdForm.userId = this.userForm.id
			this.request.post("http://localhost:9505/user/changePwd", this.pwdForm).then(res => {
				if (res.code == 200) {
					this.$message.success(res.msg)
					Cookies.remove('token')
					Cookies.remove('user_id')
					Cookies.remove('isLogin')
					this.$router.replace('/')
					this.dialogVisible = false
				} else {
					this.$message({
						message: res.msg,
						type: 'error'
					})
				}
			})
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		},
		handleAvatarSuccess(res, file) {
			if(res.code === 200){
				this.$message.success(res.msg)
				this.userForm.avatar = res.result.url
			} else{
				this.$message.error(res.msg)
			}
		},
	}
}
</script>

<style scoped>
.main {
	height: 100%;
}

.el-container {
	height: 100%;
}

.el-header {
	height: 64px !important;
}

.el-main {
	padding: 10px 0;
}

.main-box {
	width: 1000px;
	margin: 0 auto;

}

.profile-header {
	width: 100%;
	height: 200px;
	background-color: #fff;
	margin-bottom: 10px;
	background-image: url('@/assets/bgcover.webp');
}



.profileHeader-wraper {
	display: flex;
	margin: 0 20px;
	padding-top: 100px;
	align-items: center;
}

.user-box {
	display: flex;
	width: 100%;
}

.user-box img {
	width: 64px;
	height: 64px;
	border-radius: 50%;
	margin-right: 16px;
}

.user-info {
	margin-right: auto;
}

.user-name {
	margin-bottom: 8px;
}

.user-name p {
	font-size: 18px;
	font-weight: 700;
	color: #fff;
}

.user-signature p {
	font-size: 12px;
	color: hsla(0, 0%, 100%, .8);
}

.profile-main {
	display: flex;
}

.profile-left {
	margin-right: 10px;
	width: 694px;
	background-color: #fff;
	padding: 0 16px;
}

.profile-right {
	width: 296px;
}

.el-card {
	border: none;
	margin-bottom: 10px;
}

.follow-user-item {
	margin-bottom: 8px;
}

.follow-user-item a {
	display: flex;
	align-items: center;
	text-decoration: none;
}

.follow-user-item img {
	width: 40px;
	height: 40px;
	border-radius: 50%;
}

.follow-user-item .avatar {
	margin-right: 8px;
}

.username a {
	color: #262626;
	text-decoration: none;
	font-size: 16px;
}
</style>
