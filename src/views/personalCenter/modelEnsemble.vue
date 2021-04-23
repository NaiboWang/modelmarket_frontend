<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">Personal Center</el-breadcrumb-item>
    <el-breadcrumb-item>Model Ensemble</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "modelEnsemble",
  created() {
    this.$store.commit("setActivePath","/modelEnsemble");
  }
}
</script>

<style scoped>

</style>
