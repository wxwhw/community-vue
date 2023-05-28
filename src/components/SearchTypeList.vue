<template>
	<div class="main">
		<div class="type-list" v-if="this.typeList.length > 0">
			<div class="type-item" v-for="item in typeList">
				<el-card class="box-card" shadow="hover">
					<div class="type-card">
						<div class="type-info-box">
							<div class="typename">
								<a :href="`/${type}/${item.id}`">{{item.name}}</a>
							</div>
							<div class="description">
								<p>{{item.description}}</p>
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
				layout="prev, pager, next, jumper">
			</el-pagination>
		</div>
	</div>
</template>

<script>
export default {
	created() {
		this.loadTypeList()
	},
	props: {
		searchText: {
			type: String,
			required: true
		},
		type: {
			required: true,
			type: String
		}
	},
	data() {
		return {
			pageNum: 1,
			pageSize: 12,
			typeList: []
		}
	},
	methods: {
		handleCurrentChange(pageNum) {
			this.pageNum = pageNum
		},
		loadTypeList() {
			if (this.type) {
				this.request.get(`http://localhost:9505/search/type?type=${this.type}&searchText=${this.searchText}`).then(res => {
					if (res.code === 200) {
						this.typeList = res.result
					} else {
						this.$message.error("系统出错！")
					}
				})
			} else {
				this.$message.warning("类型不能为空！")
			}
		}
	}
}
</script>

<style scoped>
.type-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
}

.type-item {
	box-sizing: border-box;
	width: 33.3%;
	padding: 0 8px 16px;
}

.typename{
	margin-bottom: 16px;
}
.typename a {
	text-decoration: none;
	color: #333;
	font-size: 18px;
	font-weight: 600;
}

.description p{
	font-size: 14px;
  color: #8c8c8c;
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
</style>
