<template>
  <div>
    <el-container style="height: 100%;">
      <!-- 左边栏 -->
      <el-aside :width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246);min-height: 100%;">
        <!-- logo -->
        <div style="height: 60px; line-height: 60px; text-align: center; background-color: #545c64;">
          <img src="../assets/logo.png" alt="" width="20" style="position: relative; top: 5px;">
          <b style="color: #fff; margin-left: 5px;" v-show="logoTextShow">后台管理系统</b>
        </div>
        <!-- 左边菜单栏 -->
        <el-menu style="height: calc(100% - 60px) ;overflow:hidden; border: none;" :collapse="isCollapse"
          :default-active="activeIndex" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
          :collapse-transition=false unique-opened router>
          <el-menu-item index="/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="/sys">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span slot="title">系统管理</span>
            </template>
            <el-menu-item index="/sys/users">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/sys/posts">
              <i class="el-icon-edit"></i>
              <span slot="title">文章管理</span>
            </el-menu-item>
            <el-menu-item index="/sys/postType">
              <i class="el-icon-folder"></i>
              <span slot="title">文章分类</span>
            </el-menu-item>
            <el-menu-item index="2-5">
              <i class="el-icon-chat-line-square"></i>
              <span slot="title">评论管理</span>
            </el-menu-item>
            <el-menu-item index="/sys/tags">
              <i class="el-icon-collection-tag"></i>
              <span slot="title">标签管理</span>
            </el-menu-item>
            <el-menu-item index="">
              <i class="el-icon-message-solid"></i>
              <span slot="title">通知公告</span>
            </el-menu-item>
            <el-submenu index="2-7">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>日志管理</span>
              </template>
              <el-menu-item index="2-7-1">操作日志</el-menu-item>
              <el-menu-item index="2-7-2">登录日志</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-data-analysis"></i>
              <span slot="title">系统监控</span>
            </template>

            <el-menu-item index="3-1">
              <i class="el-icon-user-solid"></i>
              <span slot="title">在线用户</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右边开始 -->
      <el-container>
        <!-- header -->
        <el-header style="display:flex;font-size: 12px">
          <div style="flex:1;font-size: 18px;">
            <span :class="collapseBtnClass" style="cursor: pointer;" @click="collapse"></span>

            <!-- 面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block;margin-left: 10px;">
              <el-breadcrumb-item :to="{ path: '/' }">系统管理</el-breadcrumb-item>
              <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>

          </div>
          <el-dropdown style="cursor: pointer; color: #000;">
            <span class="el-dropdown-link">
              admin
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user">个人中心</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-promotion" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <!-- 主体内容 -->
        <el-main style="padding: 16px;">
          <!-- 当前页面的子路由会在router-view里展示 -->
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      activeIndex: '/',
      isCollapse: false,
      collapseBtnClass: 'el-icon-s-fold',
      sideWidth: 200,
      logoTextShow: true
    };
  },
  mounted() {
    this.activeIndex = this.$route.path
  },
  methods: {
    collapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      } else {
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    }
  }
}
</script>

<style>
.el-header {
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #fff;
}

.el-main {
  background-color: #f4f7f8;
}
</style>
