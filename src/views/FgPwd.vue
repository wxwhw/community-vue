<template>
  <div class="background">
    <div class="login-box">
      <div class="login-main">
        <div class="head-box">
          <h1>HeyBox</h1>
          <p>🚀社区的后台管理系统</p>
        </div>
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm">
          <el-form-item prop="email">
            <el-input v-model="registerForm.email" placeholder="邮箱" size="medium"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="18">
                <el-input v-model="code" placeholder="邮箱验证码" size="medium"></el-input>
              </el-col>
              <el-col :span="6" style="padding-left: 10px;">
                <el-button class="sendCode" size="medium" type="primary">发送</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" placeholder="密码" size="medium"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" placeholder="确认密码" size="medium"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" @click="submitRegister('registerForm')"
              style="width: 100%; font-size: 14px;" size="medium">重置密码</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="login-footer">
        <el-link href="/admin/login" :underline="false">返回登录</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      registerForm: {

      }
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
  color: #262626;
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

.sendCode {
  width: 100%;
  border: none;
  background-color: #3b5998;
}

.sendCode:hover {
  background-color: #30497c;
}
</style>
