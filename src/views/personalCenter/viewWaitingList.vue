<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">Personal Center</el-breadcrumb-item>
    <el-breadcrumb-item>Waiting List</el-breadcrumb-item>
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
        <el-input v-model="queryInfo.query" @keyup.enter="getOrders" placeholder="please input keywords to search"
                  clearable>
          <template #append>
            <el-button @click="getOrders" icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table ref="tableRef" @sort-change="sortData" :data="orders" border stripe class="left_layout">
      <el-table-column header-align="center" align="center" label="ID" type="index"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Order Number"
                       prop="orderID"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Model Name"
                       prop="modelName"></el-table-column>
      <el-table-column header-align="center" align="center" label="Tags">
        <template v-slot="scope">
          <el-tag
              v-for="(item, i) in scope.row.tags"
              :key="i"
          >{{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="FrameWork" prop="modelFramework"
                       width="130px"></el-table-column>
      <el-table-column header-align="center" align="center" label="Operations" width="350px">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-view" size="medium"
                     @click="viewOrder(`/viewOrder/${scope.row.id}`)">View
          </el-button>
          <el-button
              type="danger"
              icon="el-icon-delete"
              size="medium"
              @click="removeWaitingList(scope.row)"
          >Remove from Waiting List
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
  name: "viewWaitingList",
  created() {
    this.getOrders();
  },
  data() {
    return {
      orders: [],
      queryInfo: {
        query: '',
        fields: ["modelName"],
        pageNum: 1,
        pageSize: 10,
        sortProp: "orderID",
        order: -1,
      },
      queryFields: [
        {
          label: 'Order Number',
          value: 'orderID'
        },
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
      ],
      total: 0,
    };
  }, methods: {
    sortData: function(column){
      this.queryInfo.sortProp = column.prop;
      this.queryInfo.pageNum = 1; //排序后回到第一页
      this.queryInfo.order = column.order == "ascending"?1:-1;
      this.getOrders();
    },
    viewOrder(path) {
      let newPage = this.$router.resolve({
        path: path,
      })
      window.open(newPage.href, '_blank');
    },
    detectChange(values) {
      //全部删除选项时恢复默认选项
      if (values.length == 0) {
        this.queryInfo.fields = ["modelName"];
      }
    },
    getOrders: function () {
      let orders = this.waitingList.get();
      //展示如何前端多字段查询和排序
      orders = orders.filter((value,index,array)=>{
        let exist = false;
        for(let prop of this.queryInfo.fields){
          if(value[prop].includes(this.queryInfo.query)){
            exist = true;
            break;
          }
        }
        return exist;
      })
      orders.sort(this.compare(this.queryInfo.sortProp,this.queryInfo.order)); //排序
      this.orders = orders.slice((this.queryInfo.pageNum - 1) * this.queryInfo.pageSize, this.queryInfo.pageNum * this.queryInfo.pageSize);
      this.total = orders.length;
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.getOrders();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pageNum = newSize;
      this.getOrders();
    },
    removeWaitingList: function (row) {
      this.waitingList.remove(row);
      this.getOrders();
    },
    compare: function (p, type = 1) {
      return function (m, n) {
        let a = m[p];
        let b = n[p];
        if (type == 1) {
          return (a > b)?1:-1; //升序
        } else {
          return (a > b)?-1:1;
        }
      }
    }
  },
}
</script>

<style scoped>

</style>
