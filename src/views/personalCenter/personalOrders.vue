<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">
      {{ $store.state.userInfo.role == 'user' ? 'Personal Center' : 'Management Center' }}
    </el-breadcrumb-item>
    <el-breadcrumb-item>Orders</el-breadcrumb-item>
    <el-breadcrumb-item v-if="$route.path=='/personalOrders'&&$store.state.userInfo.role!='manager'" :to="{ path: '/personalOrders' }">Purchased Orders
    </el-breadcrumb-item>
    <el-breadcrumb-item v-else-if="$store.state.userInfo.role!='manager'" :to="{ path: '/personalOrders' }">Sold Orders</el-breadcrumb-item>
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
    <el-table ref="tableRef" :data="orders" @sort-change="sortData" border stripe class="left_layout">
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="ID"
                       type="index"></el-table-column>
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="Order Number"
                       prop="orderID"></el-table-column>
      <el-table-column header-align="center" :sortable="'custom'" align="center" label="Model Name"
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
      <el-table-column header-align="center" align="center" :sortable="'custom'" label="FrameWork" prop="modelFramework"
                       width="130px"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Transaction Price" prop="price"
                       width="110px"></el-table-column>
      <el-table-column v-if="$store.state.userInfo.role=='manager'" :sortable="'custom'" header-align="center" align="center"
                       label="Seller" prop="nickname"
                       width="110px"></el-table-column>
      <el-table-column v-if="$route.path=='/soldOrders'||$store.state.userInfo.role=='manager'" :sortable="'custom'"
                       header-align="center" align="center" label="Buyer" prop="nickname_buyer"
                       width="150px"></el-table-column>
      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Purchased Time"
                       prop="purchased_time"
                       width="160px"></el-table-column>
      <el-table-column v-if="$store.state.userInfo.role=='user'" header-align="center" align="center" label="Operations"
                       width="350px">
        <template v-slot="scope">
          <el-button type="primary" v-if="$route.path=='/soldOrders'" icon="el-icon-view" size="medium"
                     @click="viewOrder(`/viewSoldOrder/${scope.row.id}`)">View
          </el-button>
          <el-button type="primary" v-else icon="el-icon-view" size="medium"
                     @click="viewOrder(`/viewOrder/${scope.row.id}`)">View
          </el-button>
          <el-button
              :type="scope.row.style"
              :icon="scope.row.icon"
              size="medium"
              style="width:215px"
              @click="managerWaitingList(scope.row)"
          >{{ scope.row.waitStatus }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-else header-align="center" align="center" label="Operations"
                       width="150px">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-view" size="medium"
                     @click="viewOrder(`/viewOrder/${scope.row.id}`)">View
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
    <!--    {{// updateComponent}}-->
  </el-card>
</template>

<script>
export default {
  name: "personalOrders",
  async created() {
    await this.getOrders();
  },
  data() {
    return {
      orders: [],
      queryInfo: {
        query: '',
        fields: ["modelName"],
        pageNum: 1,
        pageSize: 10,
        sortProp: "purchased_time",
        order: -1,
      },
      queryFields: [],
      total: 0,
      columnWidth:'350px',
    };
  },
  methods: {
    viewOrder(path) {
      let newPage = this.$router.resolve({
        path: path,
      })
      window.open(newPage.href, '_blank');
    },
    sortData: async function (column) {
      this.queryInfo.sortProp = column.prop;
      this.queryInfo.pageNum = 1; //排序后回到第一页
      this.queryInfo.order = column.order == "ascending" ? 1 : -1;
      await this.getOrders();
    },
    getOrders: async function () {
      let orders;
      if (this.queryInfo.fields.length == 0) {
        this.$message.error("Please select at least one query field!");
        return false;
      }
      if (this.$route.path == "/soldOrders") {
        orders = await this.$axios.post("querySoldOrders", this.queryInfo);
      } else {
        orders = await this.$axios.post("queryPurchasedOrders", this.queryInfo);
      }
      //为waiting list 添加样式
      orders.data.map((order) => {
        if (this.waitingList.exist(order.id)) {
          order["style"] = "danger";
          order["waitStatus"] = "Remove from Waiting List";
          order["icon"] = "el-icon-delete";
        } else {
          order["style"] = "success";
          order["waitStatus"] = "Add to Waiting List";
          order["icon"] = "el-icon-plus";
        }
      });
      this.queryFields = [
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
        {
          label: 'Purchased Time',
          value: 'purchased_time'
        },
      ];
      if (this.$route.path == "/soldOrders" || this.$store.state.userInfo.role == 'manager') {
        this.queryFields.push({
          label: 'Buyer',
              value: 'buyer'
        });
      }
      if (this.$store.state.userInfo.role == 'manager') {
        this.queryFields.push({
          label: 'Seller',
          value: 'author'
        });
        this.columnWidth = '150px';
      }
      this.orders = orders.data;
      this.total = orders.total;
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
    detectChange(values) {
      //全部删除选项时恢复默认选项
      if (values.length == 0) {
        this.queryInfo.fields = ["modelName"];
      }
    },
    managerWaitingList: function (row) {
      if (row.style == "danger") {
        row.style = "success";
        row["waitStatus"] = "Add to Waiting List";
        row["icon"] = "el-icon-plus";
        this.waitingList.remove(row);
      } else {
        row.style = "danger";
        row["waitStatus"] = "Remove from Waiting List";
        row["icon"] = "el-icon-delete";
        this.waitingList.push(row);
      }
    },

  },
  // computed:{
  //   updateComponent(){
  //     if(this.$route.path == "/soldOrders")
  //     {
  //       this.getOrders();
  //       return "";
  //     }else{
  //       this.getOrders();
  //       return "";
  //     }
  //   },
  // },
  watch: {
    // 如果路由有变化，会再次执行该方法，完成组件复用功能
    // 需要判断下是否跳转到其他页面了，如果是就不去执行getOrders，不然会报错
    "$route": function (newValue, oldVaule)
    {
      if(newValue.path.includes("Orders")){
        this.getOrders();
      }
    }
  }

}
</script>

<style scoped>
.el-tag {
  margin-right: 8px;
  margin-top: 2px;
}
</style>
