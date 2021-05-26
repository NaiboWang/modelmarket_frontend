<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">Home Page</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <h2>Welcome to Machine Learning Model Market!</h2>
    <el-row class="center_layout">
      <el-col :span="6" style="margin-right:10px">
        <el-select style="width: 100%" v-model="fields" @change="detectChange" multiple
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
        <!--        注意下面js函数默认传参，与python不同！第一个参数必须显式指定为undefined，不能省略！省略会把第二个参数activesearch的true赋值给函数的第一个参数！-->
        <el-input v-model="query" @keyup.enter="getModels(undefined,activeSearch=true)"
                  placeholder="please input keywords to search"
                  clearable>
          <template #append>
            <el-button @click="getModels(undefined,activeSearch=true)" icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1">
        <el-button @click="dialogFormVisible=true" type="primary" plain style="margin-left: 5px">Advanced Search
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table ref="tableRef" :data="models" @sort-change="sortData" border stripe class="center_layout">
      <el-table-column header-align="center" align="center" label="ID" type="index"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Name"
                       prop="modelName"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Author"
                       prop="nickname"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="FrameWork" prop="modelFramework"
                       width="130px"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Price" prop="price"
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
  <el-dialog title="Advanced Search" v-model="dialogFormVisible">
    <el-form>
      <el-form-item v-for="queryField in queryFields" :label="queryField.label" :key="queryField.label"
                    prop="queryField.value">
        <el-input v-model="queryInfo.multiConditions[queryField.value]" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="getModels(advance=1,activeSearch=true)">Search</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "modelList",
  async created() {
    this.initSearch();
    await this.getModels();
  },
  data() {
    return {
      models: [],
      dialogFormVisible: false,
      backEndAddress: "http://xtra3090.d2.comp.nus.edu.sg:8086",
      query: '',
      fields: ["modelName"],
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        sortProp: "updated_time",
        order: -1,
        advance: 0,
        multiConditions: {},
      },
      queryFields: [
        {
          label: 'Model Name',
          value: 'modelName',
          type: 'text',
        },
        {
          label: 'Author',
          value: 'nickname',
          type: 'text',
        },
        {
          label: 'Framework',
          value: 'modelFramework',
          type: 'text',
        },
        {
          label: 'Price',
          value: 'price',
          type: 'number',
        },
        {
          label: 'Tag',
          value: 'tags',
          type: 'array',
        },
        {
          label: 'Update Time',
          value: 'updated_time',
          type: 'datetime',
        },
      ],
      total: 0,
    };
  },
  methods: {
    initSearch: function () {
      for (let item of this.queryFields) {
        this.queryInfo.multiConditions[item.value] = '';
      }
    },
    viewModel(id, buy = false) {
      let newPage = this.$router.resolve({
        path: '/viewModel/' + id,
        query: {
          buy: buy,
        },
      })
      window.open(newPage.href, '_blank');
    },
    sortData: async function (column) {
      console.log(column);
      if (column.prop == null) {
        this.queryInfo.sortProp = 'updated_time';
      } else {
        this.queryInfo.sortProp = column.prop;
      }
      this.queryInfo.pageNum = 1; //排序后回到第一页
      this.queryInfo.order = column.order == "ascending" ? 1 : -1;
      await this.getModels();
    },
    getModels: async function (advance = 0, activeSearch = false) {
      if (this.fields.length == 0) {
        this.$message.error("Please select at least one query field!");
        return false;
      }
      if (activeSearch) {
        this.queryInfo.advance = advance;
        this.queryInfo.pageNum = 1;
      }
      let queryInfo = this.$lodash.clone(this.queryInfo);
      queryInfo.queryFields = JSON.stringify(this.queryFields);
      queryInfo.multiConditions = JSON.stringify(queryInfo.multiConditions);
      if (this.queryInfo.advance == 1) {
        queryInfo.query = '';
      }
      queryInfo.fields = [];
      for (let field of this.fields){
        let type = "text";
        for (let item of this.queryFields) {
          if (item.value == field) {
            type = item.type;
            break;
          }
        }
        queryInfo.fields.push({name:field, type:type, query: this.query});
      }
      queryInfo.fields = JSON.stringify(queryInfo.fields);
      let models = await this.$axios.post("queryModels", queryInfo);
      this.models = models.data;
      this.total = models.total;
      this.dialogFormVisible = false;
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
        this.fields = ["modelName"];
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
