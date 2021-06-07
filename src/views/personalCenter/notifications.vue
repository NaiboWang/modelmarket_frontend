<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">
      {{ $store.state.userInfo.role == 'user' ? 'Personal Center' : 'Management Center' }}
    </el-breadcrumb-item>
    <el-breadcrumb-item>Notifications</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-button type="primary" style="float: left;margin-bottom: 10px">Mark all as read</el-button>
    <el-table ref="tableRef" :data="notifications" empty-text="No notifications" class="left_layout"
              style="text-align: left!important " :show-header="false">
           <el-table-column header-align="center" align="left" label="Message" prop="message"
      >
        <template v-slot="scope">
          <el-link :href="'viewModel/Discussion/'+scope.row.discussionID" target="_blank" style="font-size: 1.3em!important;font-weight: bold" type="primary" v-if="scope.row.read==0">{{ scope.row.message }}</el-link>
          <el-link :href="'viewModel/Discussion/'+scope.row.discussionID" target="_blank" style="font-size: 1.3em!important;" v-else>{{ scope.row.message }}</el-link>

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
  async created() {
    this.$store.commit("setActivePath", 'notifications');
    let notifications = await this.$axios.get("queryNotifications", {
      params: {
        "pageNum": 1,
      }
    });
    this.notifications = notifications.data;
  },
  data() {
    return {
      notifications: [],
      total: 0,
    };
  },
  methods: {},
}
</script>

<style scoped>
.el-tag {
  margin-right: 8px;
  margin-top: 2px;
}
</style>
