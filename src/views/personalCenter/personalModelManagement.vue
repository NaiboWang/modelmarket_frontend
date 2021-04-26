<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-if="$route.path=='/personalModelManagement'" :to="{ path: '/personalHome' }">Personal Center
    </el-breadcrumb-item>
    <el-breadcrumb-item v-else-if="$route.path=='/managementModels'" :to="{ path: '/managementHome' }">Management
      Center
    </el-breadcrumb-item>
    <el-breadcrumb-item>Personal Model Management</el-breadcrumb-item>
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
        <el-input v-model="queryInfo.query" @keyup.enter="getModels" placeholder="please input keywords to search"
                  clearable>
          <template #append>
            <el-button @click="getModels" icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table ref="tableRef" :data="models" @sort-change="sortData" border stripe class="left_layout">
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="ID" type="index"></el-table-column>
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="Name" prop="modelName"></el-table-column>
      <el-table-column header-align="center" align="center" label="Tags">
        <template v-slot="scope">
          <el-tag
              v-for="(item, i) in scope.row.tags"
              :key="i"
          >{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" :sortable="'custom'" label="FrameWork" prop="modelFramework"
                       width="130px"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Update Time" prop="updated_time"
                       width="160px"></el-table-column>
<!--      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Create Time" prop="created_time"-->
<!--                       width="200px"></el-table-column>-->
      <el-table-column header-align="center" align="center" :sortable="'custom'" label="Status" prop="status"
                       width="110px">
        <template v-slot="scope">
          <span style="color:blue" v-if="scope.row.status==true">Normal</span>
          <span v-else>Disabled</span>
        </template>

      </el-table-column>
      <el-table-column header-align="center" align="center" label="Operations" width="280px">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="medium"
                     @click="editModel(`${scope.row.id}`)">View/Edit
          </el-button>
          <el-popconfirm
              confirmButtonText='Yes'
              cancelButtonText='No'
              icon="el-icon-info"
              iconColor="red"
              title="Do you really want to delete this model?"
              @confirm='deleteModel(`${scope.row.id}`)'
          >
            <template #reference>
              <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="medium"
              >Delete
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
    <el-row>
      <el-col :span="6">
        <el-button style="float: left" type="primary" @click="$router.push('/manageModel/-1')">New Model</el-button>
      </el-col>
    </el-row>

  </el-card>
</template>

<script>
export default {
  name: "personalModelManagement",
  async created() {
    await this.getModels();
  },
  data() {
    return {
      models: [],
      queryInfo: {
        query: '',
        fields: ["modelName"],
        pageNum: 1,
        pageSize: 10,
        sortProp: "updated_time",
        order:-1,
      },
      queryFields: [
        {
          label: 'Model Name',
          value: 'modelName'
        },
        {
          label: 'Framework',
          value: 'modelFramework'
        },
        {
          label: 'Tag',
          value: 'tags'
        },
        {
          label: 'Update Time',
          value: 'updated_time'
        },
      ],
      total: 0,
    };
  },
  methods: {
    editModel(id) {
      let newPage = this.$router.resolve({
        path: '/manageModel/'+id,
      })
      window.open(newPage.href, '_blank');
    },
    sortData: async function(column){
      this.queryInfo.sortProp = column.prop;
      this.queryInfo.pageNum = 1; //排序后回到第一页
      this.queryInfo.order = column.order == "ascending"?1:-1;
      await this.getModels();
    },
    getModels: async function () {
      if (this.queryInfo.fields.length == 0) {
        this.$message.error("Please select at least one query field!");
        return false;
      }
      let models = await this.$axios.post("queryModelsManagement", this.queryInfo);
      this.models = models.data;
      this.total = models.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getModels();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pageNum = newSize;
      this.getModels();
    },
    detectChange(values) {
      //全部删除选项时恢复默认选项
      if (values.length == 0) {
        this.queryInfo.fields = ["modelName"];
      }
    },
    deleteModel:async function (id){
      await this.$axios.get("deleteModel",{
        params:{
          "id":id,
        }
      });
      await this.getModels();
    }
  },
}
</script>

<style scoped>
.el-tag{
  margin-right:8px;
  margin-top:2px;
}
</style>
