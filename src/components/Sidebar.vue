<template>
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
</template>

<script>
export default {
  name: 'Sidebar',
  data(){
    return {
      activeIndex: '/',
      sideWidth: 200,
      logoTextShow: true
    }
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
<style></style>
