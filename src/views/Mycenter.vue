<template>
  <div class="main">
    <!-- 头像上传框 -->
    <el-dialog title="修改头像" :visible.sync="dialogVisible" width="800px">
      <!-- 图片裁剪 -->
      <el-row style="height: 350px;">
        <el-col :span="12" style="height: 100%;">
          <vueCropper ref="cropper" @realTime="realTime" :img="baseUrl + userForm.avatar" :canMove="false" fixed
            :fixedNumber="cropperOption.fixedNumber" mode="contain" :centerBox="true" :outputSize="cropperOption.size"
            :outputType="cropperOption.outputType" :autoCrop="true" :canScale="false"></vueCropper>
        </el-col>
        <el-col :span="12" style="height: 100%; display: flex; align-items: center;">
          <div :style="previewStyle">
            <div :style="previews.div" class="uploadPreview">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </el-col>
      </el-row>


      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpload">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-row>
      <el-col :xs="24" :sm="16" :lg="12" :xl="8">
        <el-card class="box-card">
          <!-- <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div> -->

          <div class="user-info">
            <el-tabs v-model="activeTab" @tab-click="handleClick">
              <el-tab-pane label="基本信息" name="first">
                <div class="user-avatar">
                  <div class="block" style="text-align: center;">
                    <img :src="fullUrl" alt="" @click="dialogVisible = true">
                  </div>
                </div>
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

                  <el-form-item label="角色">
                    <el-select v-model="userForm.role" placeholder="请选择角色" :disabled="userForm.role !== 'SuperAdmin'">
                      <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
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

                  <el-form-item>
                    <el-button type="primary" @click="saveUser('userForm')">保存</el-button>
                    <el-button @click="resetForm('userForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <el-tab-pane label="修改密码" name="second">
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
                    <el-button type="primary" @click="changePwd('pwdForm')">保存</el-button>
                    <el-button @click="resetForm('pwdForm')">重置</el-button>
                  </el-form-item>

                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
    
<script>
import Cookies from 'js-cookie'

export default {
  created() {
    this.token = Cookies.get("token")
    if (this.token == undefined || this.token == null || this.token == '') {
      this.$router.push('/login')
    }
    this.loadUserInfo(this.token)
  },
  computed: {
    fullUrl() {
      return `${this.baseUrl}` + `${this.userForm.avatar}`
    }
  },
  data() {
    return {
      token: '',
      baseUrl: 'http://localhost:9505/',
      cropperOption: {
        img: '',
        size: 1,
        outputType: 'png',
        fixedNumber: [1, 1]
      },
      dialogVisible: false,
      activeTab: 'first',
      userId: 125,
      pwdForm: {},
      userForm: {
        avatar: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, message: '长度大于3个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, message: '长度大于2个字符', trigger: 'blur' }
        ]
      },
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
      previews: {},
      previewStyle: {}
    }
  },
  methods: {
    loadUserInfo(token) {
      this.request.get("/user/getUserByToken", { params: { token: token } }).then(res => {
        if (res.code == 200) {
          this.userForm = res.result
        }
      })
    },
    handleClick() {

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
              this.loadUserInfo(this.token)
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    realTime(data) {
      var previews = data
      this.previewStyle = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0 auto",
        zoom: 200 / previews.h,
        borderRadius: "50%"
      }
      this.previews = data
    },
    submitUpload() {
      this.dialogVisible = false,
        this.$refs.cropper.getCropBlob(data => {
          const file = new File([data], 'filename.png', { type: data.type })
          const formData = new FormData()
          formData.append('file', file)
          formData.append('id', this.userForm.id)
          this.request.post("http://localhost:9505/upload/uploadAvatar", formData).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        })
    },
    changePwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.pwdForm.userId = this.userForm.id
          this.request.post("http://localhost:9505/user/changePwd", this.pwdForm).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              Cookies.remove('token')
              Cookies.remove('user_id')
              Cookies.remove('isLogin')
              this.$router.replace('/')
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
    }

  }
}
</script>
    
<style scoped>
.user-avatar {
  margin-bottom: 20px;
}

.user-avatar .block img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.el-avatar:hover {
  cursor: pointer;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.el-card {
  margin: 0 10px;
}


</style>
    