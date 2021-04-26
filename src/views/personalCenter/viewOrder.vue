<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">{{$store.state.userRole=='user'?'Personal Center':'Management Center'}}</el-breadcrumb-item>
    <el-breadcrumb-item>Orders</el-breadcrumb-item>
    <el-breadcrumb-item v-if="$route.path.includes('viewOrder')&&$store.state.userRole!='manager'" :to="{path:'/personalOrders'}">Purchased Orders</el-breadcrumb-item>
    <el-breadcrumb-item v-else-if="$store.state.userRole!='manager'" :to="{path:'/soldOrders'}">Sold Orders</el-breadcrumb-item>
    <el-breadcrumb-item>Order Details</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>


    <el-row>
      <el-col :span="6"></el-col>
      <el-col :span="12" style="text-align: left">
        <h2 style="text-align: center">Order Details</h2>
        <table style="margin:0 auto">
          <tr>
            <td style="text-align: right">Order Number:</td>
            <td>{{ orderInfo["orderID"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Model Name:</td>
            <td>{{ orderInfo["modelName"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Model Author:</td>
            <td>{{ orderInfo["author"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Model Framework:</td>
            <td>{{ orderInfo["modelFramework"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Model Description:</td>
            <td style="word-wrap: break-word;word-break: break-all;overflow: hidden;max-height: 100px;">
              {{ orderInfo["modelDescription"] }}
            </td>
          </tr>
          <tr>
            <td style="text-align: right">Tags:</td>
            <td style="word-wrap: break-word;word-break: break-all;overflow: hidden;max-height: 100px;">
              <el-tag
                  v-for="(item, i) in orderInfo['tags']"
                  :key="i"
              >{{ item }}
              </el-tag>
            </td>
          </tr>
          <tr>
            <td width="200px" style="text-align: right">Model File Name:</td>
            <td>{{ orderInfo["filename"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Purchased Time:</td>
            <td>{{ orderInfo["purchased_time"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Model Update Time:</td>
            <td>{{ orderInfo["updated_time"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Transaction Price:</td>
            <td>SGD {{ orderInfo["price"] }}</td>
          </tr>
          <tr v-if="'income_author' in orderInfo">
            <td style="text-align: right">Income:</td>
            <td>SGD {{ orderInfo["income_author"] }}</td>
          </tr>
          <tr v-if="'income_manager' in orderInfo">
            <td style="text-align: right">Royalty:</td>
            <td>SGD {{ orderInfo["income_manager"] }}</td>
          </tr>
        </table>
        <div style="text-align: center;margin-top: 15px">
          <el-button type="primary" icon="el-icon-download" size="medium" style="width:215px" @click="downloadModel">Download
            Model
          </el-button>
        </div>
        <div style="text-align: center;margin-top: 15px">
          <el-button
              v-if="$store.state.userRole=='user'"
              :type="style"
              :icon="icon"
              size="medium"
              style="width:215px"
              @click="managerWaitingList(orderInfo)"
          >{{ waitStatus }}
          </el-button>
        </div>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "viewOrder",
  async created() {
    await this.getOrder();
    if(this.$route.path.includes('viewOrder'))
    {
      this.$store.commit("setActivePath","/personalOrders");
    }else{
      this.$store.commit("setActivePath","/soldOrders");
    }

  },
  methods: {
    getOrder: async function () {
      let orderInfo = await this.$axios.get("queryOrder", {
        params: {
          "id": this.$route.params.id,
        }
      });
      this.orderInfo = orderInfo.data;
      //Show the purchase dialogue
      if (this.$route.query["buy"]) {
        this.dialogFormVisible = true;
      }
      if(!this.waitingList.exist(this.orderInfo.id)){
        this.style = "success";
        this.waitStatus = "Add to Waiting List";
        this.icon = "el-icon-plus";
      }else{
        this.style = "danger";
        this.waitStatus = "Remove from Waiting List";
        this.icon = "el-icon-delete";
      }
    },
    downloadModel:function (){
      window.open(this.$axios.defaults.baseURL+'downloadModel?type=0&id='+ this.orderInfo.id);
    },
    managerWaitingList: function (row){
      if(this.style == "danger") {
        this.style = "success";
        this.waitStatus = "Add to Waiting List";
        this.icon = "el-icon-plus";
        this.waitingList.remove(row);
      }else{
        this.style = "danger";
        this.waitStatus = "Remove from Waiting List";
        this.icon = "el-icon-delete";
        this.waitingList.push(row);
      }
    },
  },
  data() {
    return {
      orderInfo: {},
      style:"",
      waitStatus:"",
      icon:"",
    };
  },
}
</script>

<style scoped>
td {
  padding-top: 10px;
  padding-left: 5px;
}
</style>
