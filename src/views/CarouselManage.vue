<template>
	<div class="main">
		<!-- 搜索栏 -->
		<div style="margin: 10px 0;">
			<el-select v-model="auditState" style="width:200px; margin-right: 10px;" placeholder="审核状态">
				<el-option v-for="item in auditStates" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="type" style="width:200px; margin-right: 10px;" placeholder="类型" v-if="typeList.length > 0">
				<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>

			<el-select v-else v-model="type" style="width:200px; margin-right: 10px;" placeholder="类型">
				<el-option v-for="item in defaultTypeList" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>

			<el-input v-model="title" style="width:200px; margin-right: 10px;" placeholder="标题"></el-input>

			<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			<el-button icon="el-icon-refresh-right" plain @click="reset">重置</el-button>
		</div>

		<!-- 工具栏 -->
		<div style="margin: 10px 0;">
			<el-button type="primary" plain icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
		</div>

		<!-- 表格 -->
		<el-table :data="tableData" stripe border>
			<el-table-column prop="id" label="编号" width="80" fixed sortable></el-table-column>
			<el-table-column prop="type" label="类型"></el-table-column>
			<el-table-column prop="auditState" label="审核状态">
				<template slot-scope="scope">
					<el-tag :type="statusType(scope.row.auditState)" disable-transitions effect="dark">
						<span v-if="scope.row.auditState == 'PASS'">通过</span>
						<span v-if="scope.row.auditState == 'REJECT'">驳回</span>
						<span v-if="scope.row.auditState == 'PENDING'">待审核</span>
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题"></el-table-column>
			<el-table-column prop="imgUrl" label="预览图片">
				<template slot-scope="scope">
					<el-popover placement="top-start" width="400" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
						<img :src="scope.row.imgUrl" alt="" style="width: 100%;">
						<el-button slot="reference">查看</el-button>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="跳转链接">
				<template slot-scope="scope">
					<a :href="scope.row.actUrl" target="_blank">点击查看</a>
				</template>
			</el-table-column>
			<el-table-column prop="creator" label="创建人"></el-table-column>
			<el-table-column prop="startAt" label="开始时间"></el-table-column>
			<el-table-column prop="endAt" label="结束时间"></el-table-column>
			<el-table-column prop="createAt" label="创建时间" sortable></el-table-column>
			<el-table-column prop="updateAt" label="更新时间" sortable></el-table-column>
			<el-table-column fixed="right" label="操作" align="center">
				<template slot-scope="scope">
					<template v-if="scope.row.auditState == 'PASS'">
						<el-button size="mini" @click="audit(scope.row, 'REJECT')" type="text" icon="el-icon-close"
							style="color: #F56C6C;">驳回</el-button>
					</template>
					<template v-else-if="scope.row.auditState == 'PENDING'">
						<el-button size="mini" @click="audit(scope.row, 'PASS')" type="text" icon="el-icon-check">通过</el-button>
						<el-button size="mini" @click="audit(scope.row, 'REJECT')" type="text" icon="el-icon-close"
							style="color: #F56C6C;">驳回</el-button>
					</template>
					<template v-else>
						<el-button size="mini" @click="audit(scope.row, 'PASS')" type="text" icon="el-icon-check">通过</el-button>
					</template>
					<el-button type="text" slot="reference" icon="el-icon-delete" style="color: #F56C6C;" @click="deleteCarousel(scope.row.id)">删除</el-button>
				</template>

			</el-table-column>
		</el-table>

		<!-- 新增轮播图模态框 -->
		<el-dialog title="新增标签" :visible.sync="dialogVisible" width="400px">
			<el-form ref="form" :model="form" label-width="80px" :rules="rules">
				<el-form-item label="标题" prop="title">
					<el-input v-model="form.title" placeholder="请输入标题..."></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">

					<el-select v-model="form.type" style="width: 100%;" placeholder="请选择类型" clearable>
						<el-option v-for="item in defaultTypeList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="图片地址" prop="imgUrl">
					<el-input v-model="form.imgUrl" placeholder="请输入图片地址..."></el-input>
				</el-form-item>
				<el-form-item label="跳转链接" prop="actUrl">
					<el-input v-model="form.actUrl" placeholder="请输入跳转链接..."></el-input>
				</el-form-item>
				<el-form-item label="生效时间" prop="time">
					<el-date-picker v-model="time" style="width: 100% ;margin-right: 10px;" type="datetimerange"
						start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00']"
						value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitAdd('form')">确 定</el-button>
				<el-button @click="dialogVisible = false">取 消</el-button>
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
import Cookies from 'js-cookie'
export default {
	created() {
		this.loadCarouselList()
		var userId = Cookies.get('user_id')
		var token = Cookies.get('token')
		var isLogin = Cookies.get('isLogin')
		if (userId && token && isLogin) {
			this.userId = userId
		} else {
			Cookies.remove('isLogin')
			Cookies.remove('user_id')
			Cookies.remove('token')
		}
	},
	data() {
		return {
			form: {},
			tableData: [],
			dialogVisible: false,
			pageNum: 1,
			pageSize: 10,
			time: '',
			total: 0,
			title: '',
			userId: null,
			auditState: '',
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
			type: '',
			typeList: [],
			defaultTypeList: [
				{
					value: '广告',
					label: '广告'
				}, {
					value: '文章',
					label: '文章'
				}, {
					value: '活动',
					label: '活动'
				},
			],
			rules: {
				title: [
					{ required: true, message: '请输入标题', trigger: 'blur' },
				],
				type: [
					{ required: true, message: '请选择类型', trigger: 'blur' }
				],
				imgUrl: [
					{ required: true, message: '请输入图片地址', trigger: 'blur' },
				],
				actUrl: [
					{ required: true, message: '请输入跳转链接', trigger: 'blur' },
				]
			}
		}
	},
	methods: {
		handleCurrentChange(pageNum) {
			this.pageNum = pageNum
			this.loadCarouselList()
		},
		handleSizeChange(pageSize) {
			this.pageSize = pageSize
			this.loadCarouselList()
		},
		search() {
			this.loadCarouselList().then(() => {
				const maxPage = Math.ceil(this.total / this.pageSize)
				if (this.pageNum > maxPage) {
					this.pageNum = 1;
				}
			})
		},
		reset() {
			this.auditState = ''
			this.type = ''
			this.title = ''
			this.loadCarouselList()
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
		audit(row, newState) {
			this.request.post("/carousel/audit",
				{
					id: row.id,
					auditState: newState
				}).then(res => {
					if (res.code == 200) {
						this.$message({
							message: res.msg,
							type: 'success'
						})
						this.loadCarouselList()

					} else {
						this.$message({
							message: res.msg,
							type: 'error'
						})
					}
				})
		},
		loadCarouselList() {
			return this.request.get("http://localhost:9505/carousel/carouselPage", {
				params: {
					auditState: this.auditState,
					type: this.type,
					title: this.title,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
			}).then(res => {
				if (res.code === 200) {
					this.tableData = res.result.carouselList
					this.total = res.result.total
					this.typeList = res.result.typeList
				}
			})
		},
		submitAdd(formName) {
			this.form.startAt = this.time[0]
			this.form.endAt = this.time[1]
			this.form.creator = this.userId
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.request.post("/carousel/add", this.form).then(res => {
						if (res.code == 200) {
							this.$message({
								message: res.msg,
								type: 'success'
							})
							this.dialogVisible = false
							this.form = {}
							this.loadCarouselList()
						} else {
							this.$message({
								message: res.msg,
								type: 'error'
							})
						}
					})
				} else {
					return false
				}
			})
		},
		deleteCarousel(id){
			this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post(`/carousel/delete/${id}`).then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.loadCarouselList()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      })
		}
	}
}
</script>

<style scoped></style>
