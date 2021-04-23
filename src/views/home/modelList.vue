<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">Home Page</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <h2>Welcome to Machine Learning Model Market!</h2>
    <el-row>
      <el-col :span="8" style="margin:0 auto">
        <el-input v-model="queryInfo.query" @keyup.enter="getModels" placeholder="Please input model name to search">
          <template #append>
            <el-button @click="getModels" icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table ref="tableRef" :data="models" border stripe style="min-width: 500px; max-width: 1200px;text-align: center; margin: 0 auto; margin-top:10px;
  margin-bottom:10px;">
      <el-table-column header-align="center" align="center" label="ID" type="index"></el-table-column>
      <el-table-column header-align="center" align="center" label="Name" prop="modelName"></el-table-column>
      <el-table-column header-align="center" align="center" label="Author" prop="author"></el-table-column>
      <el-table-column header-align="center" align="center" label="FrameWork" prop="modelFramework"
                       width="150px"></el-table-column>
      <el-table-column header-align="center" align="center" label="Operations" width="280px">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-view" size="medium"
                     @click="$router.push(`/viewModel/${scope.row.id}`)">View
          </el-button>
          <el-button
              type="warning"
              icon="el-icon-shopping-cart-2"
              size="medium"
              @click="$router.push(`/viewModel/${scope.row.id}?buy=true`)"
          >Buy
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
</template>

<script>
export default {
  name: "modelList",
  async created() {
    await this.getModels();
  },
  data() {
    return {
      models: [],
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  methods: {
    getModels: async function () {
      let models = await this.$axios.post("queryModels", this.queryInfo);
      this.models = models.data;
      this.total = models.total;
      console.log(this.$refs.tableRef);
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
    getElementLeft() {
      let element = this.$refs.tableRef;
      var actualLeft = element.offsetLeft;
      var current = element.offsetParent;

      while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
      }

      return actualLeft;
    }
  },
}
</script>

<style scoped>

</style>
