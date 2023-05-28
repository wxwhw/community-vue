<template>
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
</template>


<script>
export default {
  name: 'Header',
  data() {
    return {
      isCollapse: false,
      collapseBtnClass: 'el-icon-s-fold',
      sideWidth: 200,
      logoTextShow: true
    };
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
</style>
