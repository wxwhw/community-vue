<template>
  <div class="background">
    <div class="login-box">
      <div class="login-main">
        <div class="head-box">
          <h1>SakuraCat</h1>
          <p>🚀社区的后台管理系统</p>
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
        <el-link href="/admin/register" :underline="false">注册</el-link>
        <el-divider direction="vertical"></el-divider>
        <el-link href="/admin/forgetPwd" :underline="false">忘记密码</el-link>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  created(){
    var token = Cookies.get('token')
    if(token){
      this.$router.push('/admin/home/dashboard')
    }
    
  }, 
  data() {
    return {
      token: '',
      loginForm: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    submitLogin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.request.post("http://localhost:9505/user/login", {
            email: this.loginForm.email,
            pwd: this.loginForm.password
          }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => {
            if (res.code == 200) {
              if (res.result.isAdmin) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                // 设置cookie有效期七天
                Cookies.set('token', res.result.token, 7)
                this.$router.push('/admin/home/dashboard')
              } else { //不是管理员
                this.$message({
                  message: "你不是管理员！",
                  type: 'warning'
                })
              }
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
    }
  }
}
</script>

<style scoped>
.background {
  width: 100%;
  height: 100%;
  background: url('../assets/bg.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.head-box {
  margin-bottom: 16px;
}

.login-box {
  margin: 0 auto;
  border-radius: 5px;
  width: 450px;
  background-color: #fff;
}

.login-main {
  padding: 24px 24px 0 24px;
}

h1 {
  text-align: center;
  font-weight: 400;
  font-size: 36px;
  line-height: 56px;
  color: #272727;
  margin-bottom: 4px;
}

p {
  color: #8c8c8c;
  font-size: 14px;
  text-align: center;
}

.login-footer {
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 16px 24px;
  background: #f8f9fa;
}

a {
  color: #6c757d;
  font-size: 14px;
  text-decoration: none;
}

a:hover {
  color: #212529;
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

.el-button {
  background-color: #3b5998;
  border: none;
}

.el-button:hover {
  background-color: #30497c;
}
</style>
