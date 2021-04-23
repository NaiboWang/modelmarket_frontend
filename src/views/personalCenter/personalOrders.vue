<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">Personal Center</el-breadcrumb-item>
    <el-breadcrumb-item>Orders</el-breadcrumb-item>
    <el-breadcrumb-item>Purchased Orders</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "personalOrders",
}
</script>

<style scoped>

</style>
