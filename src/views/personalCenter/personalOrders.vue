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
    <!-- 表格数据 -->
    <search-box :params="searchParams" @get-data="getData" ref="searchBox" :key="refresh">
    <el-table ref="tableRef" :data="searchData" @sort-change="(column) => $refs.searchBox.sortData(column)" border stripe class="left_layout">
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
    </search-box>
    <!--    {{// updateComponent}}-->
  </el-card>
</template>

<script>
export default {
  name: "personalOrders",
  created() {
    this.init();
  },
  data() {
    return {
      refresh: true,
      searchData: [],
      searchParams: {
        queryFields: [
          {
            label: 'Model Name',
            value: 'modelName',
            type: 'text',
            comment: '',
          },
          {
            label: 'Framework',
            value: 'modelFramework',
            type: 'text',
            comment: '',
          },
          {
            label: 'Price',
            value: 'price',
            type: 'number',
            comment: '',
          },
          {
            label: 'Tag',
            value: 'tags',
            type: 'text',
            comment: '',
          },
          {
            label: 'Update Time',
            comment: ' (Must specify time, not only date)',
            value: 'updated_time',
            type: 'datetime',
          },
        ],
        apiAddress: 'querySoldOrders',
        sortProp: "purchased_time",
        defaultSearchProp: "modelName",
      },
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
    getData: function (data){
      //为waiting list 添加样式
      data.map((order) => {
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
      this.searchData = data;
    },
    init: async function () {
      if (this.$route.path == "/soldOrders") {
        this.searchParams.apiAddress = "querySoldOrders";
      } else {
        this.searchParams.apiAddress = "queryPurchasedOrders";
      }
      this.searchParams.queryFields = [
        {
          label: 'Order Number',
          value: 'orderID',
          type: 'text',
          comment: '',
        },
        {
          label: 'Model Name',
          value: 'modelName',
          type: 'text',
          comment: '',
        },
        {
          label: 'Framework',
          value: 'modelFramework',
          type: 'text',
          comment: '',
        },
        {
          label: 'Price',
          value: 'price',
          type: 'number',
          comment: '',
        },
        {
          label: 'Tag',
          value: 'tags',
          type: 'text',
          comment: '',
        },
        {
          label: 'Purchased Time',
          value: 'purchased_time',
          type: 'datetime',
          comment: ' (Must specify time, not only date)',
        },
      ];
      if (this.$route.path == "/soldOrders" || this.$store.state.userInfo.role == 'manager') {
        this.searchParams.queryFields.push({
          label: 'Buyer',
          value: 'buyer',
          type: 'text',
          comment: '',
        });
      }
      if (this.$store.state.userInfo.role == 'manager') {
        this.searchParams.queryFields.push({
          label: 'Seller',
          value: 'author',
          type: 'text',
          comment: '',
        });
        this.columnWidth = '150px';
      }
      this.refresh = !this.refresh;
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
        this.init();
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
