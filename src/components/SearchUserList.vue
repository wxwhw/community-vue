<template>
	<div class="main">
		<div class="user-list" v-if="this.userList.length > 0">
			<div class="user-item" v-for="item in userList">
				<el-card class="box-card" shadow="hover">
					<div class="user-card">
						<div class="avatar-box" v-if="item.avatar != ''">
							<img :src="`http://localhost:9505/${item.avatar}`" alt="">
						</div>
						<div class="user-info-box">
							<div class="username">
								<a :href="`/user/${item.id}`">{{ item.nickname }}</a>
							</div>
							<div class="signature">
								<p>{{ item.signature }}</p>
							</div>
						</div>
					</div>
				</el-card>
			</div>
		</div>

		<el-empty description="暂无数据" v-else></el-empty>
		<!-- 分页 -->
		<div class="block" style="background-color: #fff;padding: 20px;">
			<el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
				layout="prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
export default {
	created() {
		this.loadUserList()
	},
	props: {
		searchText: {
			required: true,
			type: String
		},
	},
	data() {
		return {
			pageNum: 1,
			pageSize: 12,
			total: 0,
			userList: []
		}
	},
	methods: {
		handleCurrentChange(pageNum) {
			this.pageNum = pageNum
		},
		loadUserList() {
			this.request.get("http://localhost:9505/search/user", {
				params: {
					searchText: this.searchText,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
			}).then(res => {
				if (res.code === 200) {
					this.userList = res.result
				} else {
					this.$message.error("系统出错！")
				}
			})
		}
	}
}
</script>

<style scoped>
.user-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
}

.user-item {
	box-sizing: border-box;
	width: 33.3%;
	padding: 0 8px 16px;
}

.user-card {
	display: flex;
}

.avatar-box {
	padding-right: 16px;
}

.avatar-box img {
	width: 72px;
}

.username a {
	text-decoration: none;
	color: #333;
}

.signature p {
	font-size: 14px;
	color: #808080;
	padding: 8px 0;
}
</style>
