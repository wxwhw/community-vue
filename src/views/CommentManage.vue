<template>
	<div class="main">
		<!-- 搜索栏 -->
		<div style="margin: 10px 0;">
			<el-input v-model="nickname" style="width:200px; margin-right: 10px;" placeholder="用户昵称"></el-input>
			<el-input v-model="content" style="width:200px; margin-right: 10px;" placeholder="评论内容"></el-input>
			<el-date-picker v-model="time" style="margin-right: 10px;" type="datetimerange" start-placeholder="开始日期"
				end-placeholder="结束日期" :default-time="['12:00:00']">
			</el-date-picker>
			<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			<el-button icon="el-icon-refresh-right" plain @click="reset">重置</el-button>
		</div>

		<!-- 表格 -->
		<el-table :data="tableData" stripe border>
			<el-table-column prop="id" label="编号" width="80" fixed sortable></el-table-column>
			<el-table-column prop="user.id" label="用户编号"></el-table-column>
			<el-table-column prop="user.nickname" label="用户昵称"></el-table-column>
			<el-table-column prop="content" label="内容"></el-table-column>
			<el-table-column prop="postId" label="文章编号"></el-table-column>
			<el-table-column label="原文链接">
				<template slot-scope="scope">
					<a :href="`http://localhost:8080/article/${scope.row.postId}`" target="_blank">点击查看</a>
				</template>

			</el-table-column>
			<el-table-column prop="createAt" label="创建时间" width="140" sortable></el-table-column>
			<el-table-column prop="updateAt" label="更新时间" width="140" sortable></el-table-column>
			<el-table-column fixed="right" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" slot="reference" icon="el-icon-delete" style="color: #F56C6C;"
						@class="delete (scope.row.id)">删除</el-button>
				</template>

			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 14, 20, 50]"
			:current-page="pageNum" :page-size="pageSize" :total="total" @size-change="handleSizeChange"
			@current-change="handleCurrentChange">
		</el-pagination>

	</div>
</template>

<script>
export default {
	created() {
		this.loadCommentList()
	},
	data() {
		return {
			tableData: [],
			total: 0,
			pageNum: 1,
			pageSize: 10,
			time: '',
			content: '',
			nickname: '',
		}
	},
	methods: {
		reset(){
			this.content = ''
			this.nickname = ''
			this.time = ''
			this.loadCommentList()
		},
		search() {
			this.loadCommentList().then(() => {
				const maxPage = Math.ceil(this.total / this.pageSize)
				if (this.pageNum > maxPage) {
					this.pageNum = 1;
				}
			})
		},
		handleSizeChange(pageSize) {
			this.pageSize = pageSize
			this.loadCommentList()
		},
		handleCurrentChange(pageNum) {
			this.pageNum = pageNum
			this.loadCommentList()
		},
		loadCommentList() {
			var startWith = ''
			var endWith = ''
			if (this.time !== '') {
				startWith = this.time[0].toLocaleString()
				endWith = this.time[1].toLocaleString()
			}
			return this.request.get("http://localhost:9505/comments/getAllComments", {
				params: {
					nickname: this.nickname,
					content: this.content,
					startWith: startWith,
					endWith: endWith,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
			}).then(res => {
				if (res.code === 200) {
					this.tableData = res.result.commentList
					this.total = res.result.total
				} else {
					this.$message.error(res.msg)
				}
			})
		},
	}
}
</script>

<style scoped></style>
