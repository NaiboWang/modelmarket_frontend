<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">Home Page</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <h2>Welcome to Machine Learning Model Market!</h2>
    <el-row class="center_layout">
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
    <el-table ref="tableRef" :data="models" @sort-change="sortData" border stripe class="center_layout">
      <el-table-column header-align="center" align="center" label="ID" type="index"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Name"
                       prop="modelName"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Author"
                       prop="author"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="FrameWork" prop="modelFramework"
                       width="130px"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Update Time" prop="updated_time"
                       width="160px"></el-table-column>
      <el-table-column header-align="center" align="center" label="Tags">
        <template v-slot="scope">
          <el-tag
              v-for="(item, i) in scope.row.tags"
              :key="i"
          >{{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="Operations" width="280px">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-view" size="medium"
                     @click="viewModel(`${scope.row.id}`)">View
          </el-button>
          <el-button
              type="warning"
              icon="el-icon-shopping-cart-2"
              size="medium"
              @click="viewModel(`${scope.row.id}`,true)"
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
  <el-dialog title="Set Backend address" v-model="dialogFormVisible">
    <el-form>
      <el-form-item label="BackEnd Address">
        <el-input v-model="backEndAddress" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="setAddress">Set!</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "modelList",
  async created() {
    let backend = window.sessionStorage.getItem("backend");
    console.log(backend);
    // if(backend == null){
    //   this.dialogFormVisible = true;
    // }
    // this.$axios.defaults.baseURL = "http://xtra3090.d2.comp.nus.edu.sg:8086/modelmarket_backend/";
    await this.getModels();
  },
  data() {
    return {
      models: [],
      dialogFormVisible:false,
      backEndAddress:"http://xtra3090.d2.comp.nus.edu.sg:8086",
      queryInfo: {
        query: '',
        fields: ["modelName"],
        pageNum: 1,
        pageSize: 10,
        sortProp: "updated_time",
        order: -1,
      },
      queryFields: [
        {
          label: 'Model Name',
          value: 'modelName'
        },
        {
          label: 'Author',
          value: 'author'
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
    setAddress: function(){
        window.sessionStorage.setItem("backend","true");
        this.$axios.defaults.baseURL = this.backEndAddress + '/modelmarket_backend/';
        this.$message.success("Backend Address set success!");
        this.dialogFormVisible = false;
        this.getModels();
    },
    viewModel(id,buy=false) {
      let newPage = this.$router.resolve({
        path: '/viewModel/'+id,
        query: {
          buy: buy,
        },
      })
      window.open(newPage.href, '_blank');
    },
    sortData: async function (column) {
      this.queryInfo.sortProp = column.prop;
      this.queryInfo.pageNum = 1; //排序后回到第一页
      this.queryInfo.order = column.order == "ascending" ? 1 : -1;
      await this.getModels();
    },
    getModels: async function () {
      if (this.queryInfo.fields.length == 0) {
        this.$message.error("Please select at least one query field!");
        return false;
      }
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
    detectChange(values) {
      //全部删除选项时恢复默认选项
      if (values.length == 0) {
        this.queryInfo.fields = ["modelName"];
      }
    },
  },
}
</script>

<style scoped>
.el-table th.gutter {
  display: table-cell !important;
}
</style>
