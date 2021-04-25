<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-if="$route.path=='/basicInfo'" :to="{ path: '/personalHome' }">Personal Center</el-breadcrumb-item>
    <el-breadcrumb-item v-else-if="$route.path=='/managementInfo'" :to="{ path: '/managementHome' }">Management Center</el-breadcrumb-item>
    <el-breadcrumb-item>Personal Info</el-breadcrumb-item>
    <el-breadcrumb-item>Basic Info</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <h3>User Info</h3>
    <div class="form_center_layout">
      <el-form :model="readableUserInfo" label-width="130px" disabled>
        <el-form-item label="Username" prop="username">
          <el-input v-model="readableUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-input v-model="readableUserInfo.role"></el-input>
        </el-form-item>
        <el-form-item label="Deposit" prop="deposit">
          <el-input v-model="readableUserInfo.deposit"></el-input>
        </el-form-item>
        <el-form-item class="disabledClass" v-if="userInfo.status == 0" label="Status" prop="status">
          <el-input v-model="readableUserInfo.status"></el-input>
        </el-form-item>
        <el-form-item class="enabledClass" v-else label="Status" prop="status">
          <el-input v-model="readableUserInfo.status"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "basicInfo",
  async created() {
    const info = await this.$axios.get('getUserInfo');
    this.userInfo = info.data;
  },
  data() {
    return {
      userInfo: {
        username:"",
        role:"",
        deposit:0,
        status:"",
      }
    }
  },
  computed:{
    readableUserInfo() {
      let info = this.userInfo;
      info.deposit = "SGD " + info.deposit;
      info.status = info.status==1?"Normal":"Disabled";
      return info;
    }
  },
  methods: {}
}
</script>

<style scoped>
.el-card {
  min-height: 630px;
}
.disabledClass :deep(.el-input__inner)
{
  color:red!important;
}
.enabledClass :deep(.el-input__inner)
{
  color:blue!important;
}
</style>
