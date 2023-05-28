<template>
  <div class="main">
    <!-- 搜索栏 -->
    <div style="margin: 10px 0;">
      <el-select v-model="scope" placeholder="作用域" style="width:100px;margin-right: 10px;" allow-create filterable
        default-first-option>
        <el-option v-for="item in scopes" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="name" style="width:200px; margin-right: 10px;" placeholder="名称"></el-input>
      <el-select v-model="auditState" placeholder="审核状态" style="width:100px;margin-right: 10px;">
        <el-option v-for="item in auditStates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button icon="el-icon-refresh-right" plain @click="reloadData">重置</el-button>
    </div>

    <!-- 工具栏 -->
    <div style="margin: 10px 0;">
      <el-button type="primary" plain icon="el-icon-plus" @click="dialogVisible = true">新增</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" stripe border>
      <el-table-column prop="id" label="id" width="80" fixed="left" sortable></el-table-column>
      <el-table-column prop="name" label="名称" fixed="left"></el-table-column>
      <el-table-column prop="scope" label="作用域" align="center" width="80">
        <template slot-scope="scope">
          <el-tag :type="scopeType(scope.row.scope)" disable-transitions effect="light">
            <span v-if="scope.row.scope == 'OFFICIAL'">官方</span>
            <span v-else-if="scope.row.scope == 'USER'">用户</span>
            <span v-else>{{ scope.row.scope }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="auditState" label="审核状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="statusType(scope.row.auditState)" disable-transitions effect="dark">
            <span v-if="scope.row.auditState == 'PASS'">通过</span>
            <span v-if="scope.row.auditState == 'REJECT'">驳回</span>
            <span v-if="scope.row.auditState == 'PENDING'">待审核</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="creatorId" label="创建人ID"></el-table-column>
      <el-table-column prop="refCount" label="引用次数" sortable></el-table-column>

      <el-table-column prop="createAt" label="创建时间" width="140" sortable></el-table-column>
      <el-table-column prop="updateAt" label="更新时间" width="140" sortable></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.auditState == 'PASS'">
            <el-button size="mini" @click="audit(scope.row, 'REJECT')" type="danger">驳回</el-button>
          </template>
          <template v-else-if="scope.row.auditState == 'PENDING'">
            <el-button size="mini" @click="audit(scope.row, 'PASS')" type="success">通过</el-button>
            <el-button size="mini" @click="audit(scope.row, 'REJECT')" type="danger">驳回</el-button>
          </template>
          <template v-else>
            <el-button size="mini" @click="audit(scope.row, 'PASS')" type="success">通过</el-button>
          </template>
          <el-button type="text" slot="reference" icon="el-icon-delete" @click="deletePostType(scope.row)"
            style="color: #F56C6C;">删除</el-button>
        </template>

      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 14, 20, 50]"
      :current-page="pageNum" :page-size="pageSize" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 新增分类表单 -->
    <el-dialog title="新增分类" :visible.sync="dialogVisible" width="400px">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" labelPosition="left">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称..."></el-input>
        </el-form-item>
        <el-form-item label="作用域" prop="scope">
          <el-select v-model="form.scope" placeholder="请选择/输入作用域..." style="width:100%" allow-create filterable
            default-first-option>
            <el-option v-for="item in scopes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" placeholder="请输入标签描述..."
            :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAdd('form')">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.loadPostType()
  },
  name: 'postType',
  data() {
    return {
      tableData: [],
      total: 0,
      dialogVisible: false,
      scope: '',
      scopes: [{
        value: 'OFFICIAL',
        label: '官方'
      },
      {
        value: 'USER',
        label: '用户'
      }],
      auditState: '',
      auditStates: [
        {
          value: 'PASS',
          label: '通过'
        }, {
          value: 'REJECT',
          label: '驳回'
        }, {
          value: 'PENDING',
          label: '待审核'
        }
      ],
      form: {},
      name: '',
      cur_page: 0,
      pageNum: 1,
      pageSize: 14,
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, message: '长度大于等于2个字符', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '请选择作用域', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入分类描述', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadPostType()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.loadPostType()
    },
    loadPostType() {
      return this.request.get("/postType/page", {
        // 查询参数
        params: {
          name: this.name,
          scope: this.scope,
          auditState: this.auditState,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.tableData = res.result.allPostTypes
        this.total = res.result.total
      })
    },
    search() {
      this.loadPostType().then(() => {
        const maxPage = Math.ceil(this.total / this.pageSize)
        if (this.pageNum > maxPage) {
          this.pageNum = 1;
        }
      })
    },
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.request.post("/postType/add", this.form).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.dialogVisible = false
              this.loadPostType()
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
    reloadData() {
      this.name = ''
      this.scope = ''
      this.auditState = ''
      this.loadPostType()
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
    scopeType(scope) {
      if (scope === 'OFFICIAL') {
        return 'danger';
      } else if (scope === 'USER') {
        return 'primary';
      } else {
        return 'info'
      }
    },
    audit(row, newState) {
      this.request.post("/postType/audit",
        {
          id: row.id,
          auditState: newState
        }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.loadPostType()

          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    deletePostType(row) {
      this.$confirm('确认删除 ' + row.name + ' 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post(`/postType/delete/${row.id}`).then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.loadPostType()
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


<style>
.el-textarea__inner {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>
