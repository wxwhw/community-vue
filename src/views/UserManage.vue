<template>
  <div class="main">
    <!-- 搜索栏 -->
    <div style="margin: 10px 0;">
      <el-input v-model="searchname" style="width:200px; margin-right: 10px;" placeholder="请输入用户昵称..."></el-input>
      <el-input v-model="email" style="width:200px; margin-right: 10px;" placeholder="请输入邮箱..."></el-input>
      <el-select v-model="rolesValue" placeholder="用户角色" style="width:150px;margin-right: 10px;">
        <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="statesValue" placeholder="用户状态" style="width:100px;margin-right: 10px;">
        <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="loadUsers">搜索</el-button>
      <el-button icon="el-icon-refresh-right" plain @click="reloadUsers">重置</el-button>
    </div>

    <!-- 工具栏 -->
    <div style="margin: 10px 0;">
      <el-button type="primary" plain icon="el-icon-plus" @click="addOrEdit()">新增</el-button>
      <el-button type="danger" plain icon="el-icon-delete" @selection-change="handleSelectionChange">批量删除</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" stripe border height="750" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" fixed="left"></el-table-column>
      <el-table-column prop="id" label="id" width="80" fixed sortable ></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
      <el-table-column prop="gender" label="性别" width="50"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="signature" label="个人简介"></el-table-column>
      <el-table-column prop="role" label="角色" width="115" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role == 'Admin' || scope.row.role == 'SuperAdmin' ? 'danger' : 'primary'"
            disable-transitions effect="dark">{{ scope.row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="65">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" active-color="#67C23A" inactive-color="#dcdfe6" active-value="Enable"
            inactive-value="Unable" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createAt" label="创建时间" width="140" sortable ></el-table-column>
      <el-table-column prop="updateAt" label="更新时间" width="140" sortable ></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit"
            @click="addOrEdit(scope.row.id, scope.row)">编辑</el-button>
          <el-button type="text" slot="reference" icon="el-icon-delete"
            @click="deleteSingleUser(scope.row.id)" style="color: #F56C6C;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[2, 5, 10, 20, 50]"
      :current-page="pageNum" :page-size="pageSize" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 新增或编辑用户表单 -->
    <el-dialog class="editUserDialog" :title="saveFormTitle" :visible.sync="insertUserDialogValue" width="630px">
      <el-form :model="form" :inline="true" :rules="rules" ref="form">
        <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="form.nickname" autocomplete="off" placeholder="请输入用户昵称" suffix-icon=“xxxx”></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off" placeholder="请输入用户邮箱" suffix-icon=“xxxx”></el-input>
        </el-form-item>

        <el-form-item v-if="showPwdInput" label="用户密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off" placeholder="请输入用户密码" show-password
            :disabled="editPassword"></el-input>
        </el-form-item>

        <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio v-model="form.state" label="Enable">正常</el-radio>
          <el-radio v-model="form.state" label="Unable">停用</el-radio>
        </el-form-item>

        <el-form-item label="个人简介" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.signature" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="insertUserDialogValue = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'UserManage',
  created() {
    this.loadUsers()
  },
  data() {
    return {
      insertUserDialogValue: false,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      searchname: '',
      email: '',
      rolesValue: '',
      statesValue: '',
      roles: [{
        value: 'User',
        label: '普通用户'
      }, {
        value: 'Admin',
        label: '管理员'
      }, {
        value: 'SuperAdmin',
        label: '超级管理员'
      }],
      states: [{
        value: 'Unable',
        label: '停用'
      }, {
        value: 'Enable',
        label: '正常'
      }],
      rowState: true,
      form: {},
      rules: {
        nickname: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, message: '长度大于3个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, message: '长度大于6个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择用户性别', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'blur' }
        ]
      },
      formLabelWidth: '80px',
      multipleSelection: [],
      editPassword: false,
      saveFormTitle: '',
      showPwdInput: true
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(path) {

    },
    loadUsers() {
      this.request.get("/user/page", {
        // 查询参数
        params: {
          searchname: this.searchname,
          email: this.email,
          role: this.rolesValue,
          state: this.statesValue,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.tableData = res.allUsers
        this.total = res.total
      })
      // //fetch请求分页查询数据
      // fetch("http://localhost:9505/user/page?searchname=" + this.searchname
      //   + "&email=" + this.email
      //   + "&role=" + this.rolesValue
      //   + "&state=" + this.statesValue
      //   + "&pageNum=" + this.pageNum
      //   + "&pageSize=" + this.pageSize + "").then(res => res.json()).then(res => {
      //     this.tableData = res.allUsers
      //     this.total = res.total
      //   })
    },
    reloadUsers() {
      this.searchname = ''
      this.email = ''
      this.rolesValue = ''
      this.statesValue = ''
      this.loadUsers()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadUsers()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.loadUsers()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //console.log(this.form)
          this.request.post("http://localhost:9505/user/save", this.form).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.insertUserDialogValue = false
              this.loadUsers()
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
    // handleSelectionChange(val){
    //   val.forEach(user => {
    //     console.log(user.id)
    //   });
    // }

    deleteSingleUser(userId) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post(`/user/delete/${userId}`).then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.loadUsers()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      })
    },

    addOrEdit(userId, rowData) {
      if (typeof (userId) == "undefined") {
        //新增
        this.saveFormTitle = '新增用户'
        this.showPwdInput = true
        this.editPassword = false
        this.form = {
          id: '',
          nickname: '',
          email: '',
          password: '123456',
          gender: '',
          role: '',
          state: 'Enable',
          signature: ''
        }
        this.insertUserDialogValue = true
      } else {
        //编辑
        this.showPwdInput = false
        this.saveFormTitle = '编辑用户'
        this.insertUserDialogValue = true
        this.editPassword = true

        // 加载原始行数据,涉及深浅拷贝，v-model双向数据绑定问题 https://zhuanlan.zhihu.com/p/84269628
        this.form = { ...rowData }
      }
    }
  }
}
</script>

<style scoped>
label {
  font-weight: 600;
}

.el-form-item {
  margin-right: 0 !important;
}

.el-form-item input {
  width: 200px !important;
}

.el-form-item .el-textarea {
  width: 480px !important;
}
</style>