<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">Personal Center</el-breadcrumb-item>
    <el-breadcrumb-item>Personal Model Management</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "personalModelManagement",
}
</script>

<style scoped>

</style>
