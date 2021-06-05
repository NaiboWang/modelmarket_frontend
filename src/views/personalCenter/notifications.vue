<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">{{$store.state.userInfo.role=='user'?'Personal Center':'Management Center'}}</el-breadcrumb-item>
    <el-breadcrumb-item>User Management</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    {{notifications}}
      <el-table ref="tableRef" :data="notifications"  border stripe class="left_layout">
        <el-table-column header-align="center" :sortable="'custom'" align="center" label="ID" type="index"></el-table-column>
        <el-table-column header-align="center"  :sortable="'custom'" align="center" label="Username" prop="username"></el-table-column>
        <el-table-column header-align="center"  :sortable="'custom'" align="center" label="Nickname" prop="nickname"></el-table-column>
        <el-table-column header-align="center" :sortable="'custom'" align="center" label="Role" prop="role"></el-table-column>
        <el-table-column header-align="center" align="center" :sortable="'custom'" label="Deposit" prop="deposit"
                         width="130px"></el-table-column>
        <el-table-column :sortable="'custom'" header-align="center" align="center" label="Register Time" prop="register_time"
                         width="160px"></el-table-column>
        <el-table-column header-align="center" align="center" :sortable="'custom'" label="Status" prop="status"
                         width="110px">
          <template v-slot="scope">
            <el-switch @change="changeUserStatus(scope.row,scope.row.id,scope.row.status)" v-model="scope.row.status">
            </el-switch>
          </template>

        </el-table-column>
        <el-table-column header-align="center" align="center" label="Operations" width="220px">
          <template v-slot="scope">
            <el-popconfirm
                confirmButtonText='Yes'
                cancelButtonText='No'
                icon="el-icon-info"
                iconColor="grey"
                title="Do you really want to reset this user's password?"
                @confirm='resetPassword(`${scope.row.id}`)'
            >
              <template  #reference>
                <el-button
                    type="primary"
                    icon="el-icon-setting"
                    size="medium"
                >Reset Password
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    <!-- 表格数据 -->
    <el-pagination
        layout="prev, pager, next"
        :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "notificationList",
  async created(){
    let notifications = await this.$axios.get("queryNotifications", {
      params: {
        "pageNum": 1,
      }
    });
    this.notifications = notifications;
  },
  data() {
    return {
      notifications:[],
      total:0,
    };
  },
  methods: {

  },
}
</script>

<style scoped>
.el-tag{
  margin-right:8px;
  margin-top:2px;
}
</style>
