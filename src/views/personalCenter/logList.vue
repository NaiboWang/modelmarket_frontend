<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">
      {{ $store.state.userRole == 'user' ? 'Personal Center' : 'Management Center' }}
    </el-breadcrumb-item>
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
        <el-input v-model="queryInfo.query" @keyup.enter="getLogs" placeholder="please input keywords to search"
                  clearable>
          <template #append>
            <el-button @click="getLogs" icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table ref="tableRef" :data="logs" @sort-change="sortData" border stripe class="left_layout">
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="ID"
                       type="index"></el-table-column>
      <el-table-column header-align="center" width="200px" :sortable="'custom'" align="center" label="Time"
                       prop="time"></el-table-column>
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="Function"
                       prop="func"></el-table-column>
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="Username"
                       prop="username"></el-table-column>
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="Nickname"
                       prop="nickname"></el-table-column>
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="Role"
                       prop="role"></el-table-column>
      <el-table-column header-align="center" align="center" :sortable="'custom'" label="Method" prop="method"
                       width="130px"></el-table-column>
      <el-table-column header-align="center" align="center" label="Operations" width="220px">
        <template v-slot="scope">
          <el-button
              type="primary"
              icon="el-icon-view"
              size="medium"
              @click="viewLog(`${scope.row['_id']['$oid']}`)"
          >View Details
          </el-button>
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
  <el-dialog title="Log Details" v-model="dialogFormVisible" @opened="openDialog">
    <div style="text-align: left">
      <div id="json"></div>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormVisible = false">Close</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import jQuery from '../../plugins/jquery-json-viewer/jsonviewer';
import '../../plugins/jquery-json-viewer/jquery.jsonview.css';

export default {
  name: "logList",
  async created() {
    await this.getLogs();
  },
  data() {
    return {
      logs: [],
      open: false, //记录是否第一次打开dialogue，因为<div id=json>标签只有第一次打开的时候才会渲染
      log: {},
      dialogFormVisible: false,
      queryInfo: {
        query: '',
        fields: ["username"],
        pageNum: 1,
        pageSize: 20,
        sortProp: "time",
        order: -1,
      },
      queryFields: [
        {
          label: 'User Name',
          value: 'username'
        },
        {
          label: 'Time',
          value: 'time'
        },
        {
          label: 'Nick Name',
          value: 'nickname'
        },
        {
          label: 'Role',
          value: 'Role'
        },
      ],
      total: 0,
    };
  },
  methods: {
    sortData: async function (column) {
      this.queryInfo.sortProp = column.prop;
      this.queryInfo.pageNum = 1; //排序后回到第一页
      this.queryInfo.order = column.order == "ascending" ? 1 : -1;
      await this.getLogs();
    },
    getLogs: async function () {
      if (this.queryInfo.fields.length == 0) {
        this.$message.error("Please select at least one query field!");
        return false;
      }
      let logs = await this.$axios.post("queryLogs", this.queryInfo);
      this.logs = logs.data;
      this.total = logs.total;
    },
    openDialog: function(){
      if(!this.open){
        jQuery("#json").JSONView(this.log);
        this.open = true;
      }
    },
    viewLog: async function (id) {
      let log = await this.$axios.get("queryLog", {
        params: {
          "id": id,
        }
      });
      this.log = JSON.stringify(log.data,null,2);
      jQuery("#json").JSONView(this.log);
      this.dialogFormVisible = true;
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getLogs();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pageNum = newSize;
      this.getLogs();
    },
    detectChange(values) {
      //全部删除选项时恢复默认选项
      if (values.length == 0) {
        this.queryInfo.fields = ["username"];
      }
    },
  },
}
</script>

<style scoped>
.el-tag {
  margin-right: 8px;
  margin-top: 2px;
}
</style>
