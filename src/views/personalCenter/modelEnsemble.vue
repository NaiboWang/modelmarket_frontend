<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">Personal Center</el-breadcrumb-item>
    <el-breadcrumb-item>Model Ensemble</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!-- 表格数据 -->
    <el-table ref="tableRef" :data="orders" border height="400px" stripe class="left_layout">
      <el-table-column header-align="center" align="center" label="ID" type="index"></el-table-column>
      <el-table-column sortable header-align="center" align="center" label="Order Number"
                       prop="orderID"></el-table-column>
      <el-table-column sortable header-align="center" align="center" label="Model Name"
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
      <el-table-column header-align="center" align="center" label="FrameWork" prop="modelFramework"
                       width="130px"></el-table-column>
      <el-table-column header-align="center" align="center" label="Weight" prop="modelFramework"
                       width="130px">
        <template v-slot="scope">
          <div class="block">
            <el-slider :min=1 :max=9 v-model="scope.row.weight"></el-slider>
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="Operations" width="350px">
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
              @click="removeWaitingList(scope.row)"
          >{{ scope.row.waitStatus }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
<!--    <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="pageNum"-->
<!--        :page-sizes="[5, 10, 15, 20]"-->
<!--        :page-size="pageSize"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="total"-->
<!--        background-->
<!--    ></el-pagination>-->
    <el-row style="margin-top: 20px">
      <el-form
          style="margin: 0 auto"
          ref="ensembleModelForm"
          :model="ensembleParams"
          label-width="130px"
      >
        <el-form-item label="Ensemble Method" prop="type">
          <el-select v-model="ensembleParams.type" placeholder="Please select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" style="margin-left:10px" @click="getEnsembledModel">
          Ensemble Model
        </el-button>
      </el-form>


    </el-row>


  </el-card>
</template>

<script>
export default {
  name: "modelEnsemble",
  created() {
    this.getOrders();
  },
  data() {
    return {
      ensembleParams: {
        type: "Voting",
        itemParams: [],
      },
      orders: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      options: [
        {
          label: "Voting",
          value: "Voting"
        }, {
          label: "Boosting",
          value: "Boosting",
        }
      ]
    };
  }, methods: {
    viewOrder(path) {
      let newPage = this.$router.resolve({
        path: path,
      })
      window.open(newPage.href, '_blank');
    },
    getOrders: async function () {
      let orders = this.waitingList.get();
      // this.orders = orders.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize);
      orders.map((order)=>{
       order["weight"] = 5;
      });
      this.orders = orders;
      this.total = orders.length;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getOrders();
    },
    handleCurrentChange(newSize) {
      this.pageNum = newSize;
      this.getOrders();
    },
    removeWaitingList: function (row) {
      this.waitingList.remove(row);
      this.getOrders();
    },
    getEnsembledModel: function () {
      this.$confirm('Do you really want to ensemble models in the waiting list?', 'Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'success'
      }).then(async () => {
        let orders = [];
        let weights = [];
        for(let i=0;i<this.orders.length;i++){
          orders.push(this.orders[i]["id"]);
          weights.push(this.orders[i]["weight"]);
        }
        orders = orders.join(",");
        weights = weights.join(",");
        window.open(this.$axios.defaults.baseURL + "ensemble_sklearn?orders="+orders+"&weights="+weights);
      }).catch(() => {
      });
    },
  },
}
</script>

<style scoped>

</style>
