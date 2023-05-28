<template>
	<div class="main">
		<!-- 搜索栏 -->
		<div style="margin: 10px 0;">
			<el-input v-model="authorId" style="width:200px; margin-right: 10px;" placeholder="作者ID"></el-input>
			<el-input v-model="title" style="width:200px; margin-right: 10px;" placeholder="标题"></el-input>
			<el-select v-model="typeId" placeholder="社区" style="width:100px;margin-right: 10px;">
				<el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
			<el-select v-model="auditState" placeholder="审核状态" style="width:100px;margin-right: 10px;">
				<el-option v-for="item in auditStates" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="official" placeholder="官方" style="width:100px;margin-right: 10px;">
				<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="top" placeholder="置顶" style="width:100px;margin-right: 10px;">
				<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="marrow" placeholder="精华" style="width:100px;margin-right: 10px;">
				<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			<el-button icon="el-icon-refresh-right" plain @click="resetValue">重置</el-button>
		</div>

		<!-- 表格 -->
		<el-table :data="tableData" stripe border fit>
			<el-table-column prop="id" label="id" fixed sortable></el-table-column>
			<el-table-column prop="user.id" label="作者id"></el-table-column>
			<el-table-column label="头像" width="60">
				<template slot-scope="scope">
					<div style="display: flex; align-items: center; justify-content: center;">
						<img :src="`${baseUrl}${scope.row.user.avatar}`" alt="" style="width: 36px;height: 36px; border-radius: 50%;">
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="user.nickname" label="作者昵称" align="center"></el-table-column>
			<el-table-column prop="title" label="标题" width="300"></el-table-column>
			<el-table-column label="额外标签" align="center" width="70">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.top == 1" size="mini" type="success">置顶</el-tag>
					<el-tag v-if="scope.row.marrow == 1" size="mini" type="warning">精华</el-tag>
					<el-tag v-if="scope.row.official == 1" size="mini">官方</el-tag>
					<el-tag v-if="scope.row.top != 1 && scope.row.marrow != 1 && scope.row.official != 1" size="mini"
						type="info">无</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="auditState" label="审核状态" align="center" width="85">
				<template slot-scope="scope">
					<el-tag :type="statusType(scope.row.auditState)" disable-transitions effect="dark">
						<span v-if="scope.row.auditState == 'PASS'">已通过</span>
						<span v-if="scope.row.auditState == 'REJECT'">已驳回</span>
						<span v-if="scope.row.auditState == 'PENDING'">待审核</span>
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="社区">
				<template slot-scope="scope">
					<el-tag type="info">{{ scope.row.articleType.name }}</el-tag>
				</template>

			</el-table-column>

			<el-table-column prop="approvals" label="点赞" sortable></el-table-column>
			<el-table-column prop="comments" label="评论" sortable></el-table-column>
			<el-table-column prop="views" label="浏览" sortable></el-table-column>
			<el-table-column prop="collections" label="收藏" sortable></el-table-column>

			<el-table-column prop="createAt" label="创建时间" width="140" sortable></el-table-column>
			<el-table-column prop="updateAt" label="更新时间" width="140" sortable></el-table-column>
			<el-table-column fixed="right" label="操作" align="center" width="120">
				<template slot-scope="scope">
					<el-button @click="showContentDialog(scope.row)" type="text" icon="el-icon-edit">审核</el-button>
					<el-popconfirm icon="el-icon-info" icon-color="red" title="确定删除该文章吗？" @confirm="deleteArticle(scope.row.id)">
						<el-button type="text" icon="el-icon-delete" style="color: #F56C6C;" slot="reference">删除</el-button>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="编辑/审核" :visible.sync="dialogVisible" width="600px">
			<div class="content-box">
				<div class="cover-image" v-if="this.previewContent.coverUrl != null && this.previewContent.coverUrl != ''">
					<img :src="baseUrl + this.previewContent.coverUrl" alt="" style="width: 100%;">
				</div>
				<div class="preview-title">
					<h1>{{ this.previewContent.title }}</h1>
				</div>
				<div class="markdown-body" v-html="this.previewContent.htmlContent"></div>
			</div>
			<div style="padding-top: 16px;">
				<el-form :model="previewContent" ref="previewContent">
					<el-form-item label="审核">
						<el-radio v-model="previewContent.auditState" label="PASS">通过</el-radio>
						<el-radio v-model="previewContent.auditState" label="REJECT">驳回</el-radio>
					</el-form-item>
					<el-form-item label="置顶">
						<el-switch v-model="previewContent.top" :active-value="1" :inactive-value="0"></el-switch>
					</el-form-item>
					<el-form-item label="官方">
						<el-switch v-model="previewContent.official" :active-value="1" :inactive-value="0"></el-switch>
					</el-form-item>
					<el-form-item label="精华">
						<el-switch v-model="previewContent.marrow" :active-value="1" :inactive-value="0"></el-switch>
					</el-form-item>
				</el-form>
			</div>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" style="margin-right: 8px;">取 消</el-button>
				<el-popconfirm title="确定吗？" @confirm="submitEdit">
					<el-button type="primary" slot="reference">确 定</el-button>
				</el-popconfirm>
			</span>
		</el-dialog>
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
		this.loadArticleList();
		this.loadArticleType()
	},
	data() {
		return {
			dialogVisible: false,
			baseUrl: 'http://localhost:9505/',
			tableData: [],
			total: 0,
			pageNum: 1,
			pageSize: 10,
			auditState: '',
			title: '',
			typeId: null,
			official: null,
			top: null,
			marrow: null,
			authorId: null,
			previewContent: {},
			states: [
				{
					value: 0,
					label: '否'
				}, {
					value: 1,
					label: '是'
				}
			],
			typeList: [],
			auditStates: [
				{
					value: 'PASS',
					label: '已通过'
				}, {
					value: 'PENDING',
					label: '待审核'
				}, {
					value: 'REJECT',
					label: '已驳回'
				},
			],
		}
	},
	methods: {
		handleSizeChange(pageSize) {
			this.pageSize = pageSize
			this.loadArticleList()
		},
		handleCurrentChange(pageNum) {
			this.pageNum = pageNum
			this.loadArticleList()
		},
		loadArticleList() {
			return this.request.get('http://localhost:9505/article/allArticles', {
				params: {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					auditState: this.auditState,
					title: this.title,
					typeId: this.typeId,
					official: this.official,
					top: this.top,
					marrow: this.marrow,
					authorId: this.authorId
				}
			}).then(res => {
				if (res.code === 200) {
					this.tableData = res.result.articleList
					this.total = res.result.total
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		loadArticleType() {
			this.request.get('http://localhost:9505/postType/allTypes').then(res => {
				if (res.code === 200) {
					this.typeList = res.result
				} else {
					this.$message.error(res.msg)

				}
			})
		},
		search() {
			this.loadArticleList().then(() => {
				const maxPage = Math.ceil(this.total / this.pageSize)
				if (this.pageNum > maxPage) {
					this.pageNum = 1;
				}
			})
		},
		resetValue() {
			this.auditState = ''
			this.title = ''
			this.typeId = null,
				this.official = null,
				this.top = null,
				this.marrow = null,
				this.authorId = null
			this.loadArticleList()
		},
		statusType(status) {
			if (status === 'PASS') {
				return 'success';
			} else if (status === 'REJECT') {
				return 'danger';
			} else {
				return 'warning';
			}
		},
		showContentDialog(rowData) {
			this.dialogVisible = true
			this.previewContent = { ...rowData }
		},
		submitEdit() {
			console.log(this.previewContent.top);
			console.log(this.previewContent.marrow);
			console.log(this.previewContent.official);
			console.log(this.previewContent.auditState);
			if (this.previewContent.auditState != 'PENDING') {
				this.request.post('http://localhost:9505/article/audit', this.previewContent).then(res => {
					if (res.code === 200) {
						this.$message.success(res.msg)
						this.loadArticleList()
						this.dialogVisible = false

					} else {
						this.$message.error(res.msg)
					}
				})
			} else {
				this.$message.warning('请审核！')
			}
		},
		deleteArticle(id) {
			this.request.post('http://localhost:9505/article/delete?id=' + id).then(res => {
				if (res.code === 200) {
					this.$message.success(res.msg)
					this.loadArticleList()
				} else {
					this.$message.error(res.msg)
				}
			})
		}
	}
}
</script>

<style scoped>
@import "~mavon-editor/dist/markdown/github-markdown.min.css";

.el-tag {
	margin-right: 8px;
}

.content-box {
	padding-bottom: 20px;
	border-bottom: 1px solid #f0f0f0;
}

.preview-title h1 {
	color: black;
	font-size: 24px;
	font-weight: 600;
}
</style>
