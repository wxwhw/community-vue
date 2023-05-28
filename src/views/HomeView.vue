<template>
  <div class="home" style="height: 100%;">
    <el-container style="height: 100%;">
      <!-- 左边栏 -->
      <el-aside :width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246);min-height: 100%;">
        <!-- logo -->
        <div style="height: 64px; line-height: 64px; text-align: center; background-color: #FFC0CB;">
          <img src="../assets/cat.png" alt="" width="30" style="position: relative; top: 5px;">
          <span style="color: #313335; margin-left: 5px; font-size: 20px; font-weight: 400;"
            v-show="logoTextShow">SakuraCat</span>
        </div>
        <!-- 左边菜单栏 -->
        <el-menu style="height: calc(100% - 64px) ;overflow:hidden; border: none;" :collapse="isCollapse"
          :default-active="activeIndex" background-color="#35383e" text-color="#fff" active-text-color="#ffd04b"
          :collapse-transition=false unique-opened router :default-openeds="['/admin/sys', '2-7']">
          <el-menu-item index="/admin/home/dashboard">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="/admin/sys">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span slot="title">系统管理</span>
            </template>
            <el-menu-item index="/admin/sys/users">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/sys/posts">
              <i class="el-icon-edit"></i>
              <span slot="title">文章管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/sys/postType">
              <i class="el-icon-folder"></i>
              <span slot="title">分类管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/sys/comments">
              <i class="el-icon-chat-line-square"></i>
              <span slot="title">评论管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/sys/tags">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">标签管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/sys/carousel">
              <i class="el-icon-picture-outline"></i>
              <span slot="title">轮播图管理</span>
            </el-menu-item>
          </el-submenu>

          <!-- <el-menu-item index="">
            <i class="el-icon-message-solid"></i>
            <span slot="title">通知公告</span>
          </el-menu-item> -->
          <el-menu-item index="/admin/center/details">
            <i class="el-icon-user-solid"></i>
            <span slot="title">个人中心</span>
          </el-menu-item>
        </el-menu>

      </el-aside>

      <el-container>
        <!-- header -->
        <el-header style="display:flex;height: 64px;">
          <div style="flex:1;font-size: 18px;">
            <span :class="collapseBtnClass" style="cursor: pointer;" @click="collapse"></span>

          </div>
          <el-dropdown style="cursor: pointer; color: #000;display:flex;align-items: center;">
            <span class="el-dropdown-link" style="display: flex; align-items: center;">
              <img class="user-avatar" :src="baseUrl + userInfo.avatar" alt=""
                v-if="userInfo.avatar != null && userInfo.avatar != ''">
              <!-- <el-avatar slot="reference" :src="baseUrl + this.userInfo.avatar" size="medium"></el-avatar> -->
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user" @click.native="center">个人中心</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-promotion" divided @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <!-- 主体内容 -->
        <el-main style="padding: 16px;">
          <!-- 当前页面的子路由会在router-view里展示 -->
          <div style="padding: 16px; background-color: #fff;">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'Home',
  created() {
    // console.log('home');
    this.token = Cookies.get("token")
    if (this.token == undefined || this.token == null || this.token == '') {
      this.$router.push('/login')
    } else {
      this.loadUserInfo(this.token)
    }

  },
  // computed: {
  //   fullUrl(){
  //     return `${this.baseUrl}${this.userInfo.avatar}`
  //   }
  // },
  data() {
    return {
      token: '',
      userInfo: {},
      baseUrl: 'http://localhost:9505/',
      activeIndex: '/',
      isCollapse: false,
      collapseBtnClass: 'el-icon-s-fold',
      sideWidth: 208,
      logoTextShow: true
    };
  },
  mounted() {
    this.activeIndex = this.$route.path
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path
    }
  },
  methods: {
    loadUserInfo(token) {
      this.request.get("/user/getUserByToken", { params: { token: token } }).then(res => {
        if (res.code === 200) {
          this.userInfo = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    collapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      } else {
        this.sideWidth = 208
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    },
    center() {
      if (this.$route.path !== '/admin/center/details') {
        this.$router.push('/admin/center/details');
        // console.log(this.activeIndex);
      }
    },
    logout() {
      Cookies.remove('token')
      Cookies.remove('user_id')
      Cookies.remove('isLogin')
      Cookies.remove('isAdmin')
      this.$router.push('/index')
    },

  }
}
</script>

<style scoped>
.el-header {
  color: #333;
  line-height: 64px;
}

.el-aside {
  color: #fff;
}

.el-main {
  background-color: #f4f7f8;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
</style>
