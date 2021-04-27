<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">{{$store.state.userRole=='user'?'Personal Center':'Management Center'}}</el-breadcrumb-item>
    <el-breadcrumb-item>User Management</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row class="left_layout">
      <el-col :span="6" style="margin-right:10px">
        <el-select style="width: 100%" v-model="queryInfo.fields" @change="detectChange" multiple
                   placeholder="Please choose query fields">
          <el-option
              v-for="item in queryFields"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="10">
        <el-input v-model="queryInfo.query" @keyup.enter="getUsers" placeholder="please input keywords to search"
                  clearable>
          <template #append>
            <el-button @click="getUsers" icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table ref="tableRef" :data="users" @sort-change="sortData" border stripe class="left_layout">
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="ID" type="index"></el-table-column>
      <el-table-column header-align="center"  :sortable="'custom'" align="center" label="Name" prop="username"></el-table-column>
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
    <!-- 分页区域 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
    ></el-pagination>

  </el-card>
</template>

<script>
export default {
  name: "userList",
  async created() {
    await this.getUsers();
  },
  data() {
    return {
      users: [],
      queryInfo: {
        query: '',
        fields: ["username"],
        pageNum: 1,
        pageSize: 10,
        sortProp: "id",
        order:-1,
      },
      queryFields: [
        {
          label: 'User Name',
          value: 'username'
        },
        {
          label: 'Role',
          value: 'Role'
        },
        {
          label: 'Register Time',
          value: 'register_time'
        },
      ],
      total: 0,
    };
  },
  methods: {
    sortData: async function(column){
      this.queryInfo.sortProp = column.prop;
      this.queryInfo.pageNum = 1; //排序后回到第一页
      this.queryInfo.order = column.order == "ascending"?1:-1;
      await this.getUsers();
    },
    getUsers: async function () {
      if (this.queryInfo.fields.length == 0) {
        this.$message.error("Please select at least one query field!");
        return false;
      }
      let users = await this.$axios.post("getUserList", this.queryInfo);
      this.users = users.data;
      this.total = users.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getUsers();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pageNum = newSize;
      this.getUsers();
    },
    detectChange(values) {
      //全部删除选项时恢复默认选项
      if (values.length == 0) {
        this.queryInfo.fields = ["username"];
      }
    },
    changeUserStatus: async function(row,id,status){
      let info = await this.$axios.get("changeUserStatus",{
        params:{
          "id":id,
          "status":status,
        }
      });
      if(info){
        this.$message.success(info.msg);
      }else{
        row.status = !status;
      }
    },
    resetPassword: async function(id){
      let info = await this.$axios.get("resetPassword",{
        params:{
          "id":id,
        }
      });
      if(info){
        this.$message.success(info.msg);
      }
    },
  },
}
</script>

<style scoped>
.el-tag{
  margin-right:8px;
  margin-top:2px;
}
</style>
