<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">Model List</el-breadcrumb-item>
    <el-breadcrumb-item>Model Details</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <h2>Model Details</h2>

    <el-row>
      <el-col :span="6"></el-col>
      <el-col :span="12" style="text-align: left">
        <table style="margin:0 auto">
          <tr>
            <td width="200px" style="text-align: right">Model Name：</td>
            <td>{{ modelInfo["modelName"] }}</td>
          </tr>
          <tr>
            <td width="200px" style="text-align: right">Model Author：</td>
            <td>{{ modelInfo["author"] }}</td>
          </tr>
          <tr>
            <td width="200px" style="text-align: right">Model Framework：</td>
            <td>{{ modelInfo["modelFramework"] }}</td>
          </tr>
          <tr>
            <td width="200px" style="text-align: right">Model Description：</td>
            <td style="word-wrap: break-word;word-break: break-all;overflow: hidden;max-height: 100px;">
              {{ modelInfo["modelDescription"] }}
            </td>
          </tr>
          <tr>
            <td width="200px" style="text-align: right">Model File Name：</td>
            <td>{{ modelInfo["filename"] }}</td>
          </tr>
          <tr>
            <td width="200px" style="text-align: right">Model Price:</td>
            <td style="color:blue;font-size:20px">SGD {{ modelInfo["price"] }}</td>
          </tr>
        </table>
        <div style="text-align: center;margin-top: 15px">
          <el-button type="warning" icon="el-icon-shopping-cart-2" size="medium" @click="dialogFormVisible = true">Buy
            Model
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <el-dialog title="Buy Model" v-model="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="Model Name">
        <el-input v-model="modelInfo.modelName" autocomplete="off" disabled style="color:black"></el-input>
      </el-form-item>
      <el-form-item label="Price (SGD)">
        <el-input v-model="modelInfo.price" autocomplete="off" disabled style="color:black"></el-input>
      </el-form-item>
      <el-form-item label="Your Deposit (SGD)">
        <el-input v-model="userInfo.deposit" autocomplete="off" disabled style="color:black"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="buyModel">Buy!</el-button>
      <el-button @click="dialogFormVisible = false">Cancel</el-button>
    </span>
    </template>
  </el-dialog>

</template>

<script>
export default {
  name: "viewModel",
  async created() {
    await this.getModel();
  },
  methods: {
    getModel: async function () {
      let modelInfo = await this.$axios.get("queryModel", {
        params: {
          "id": this.$route.params.id,
        }
      });
      this.modelInfo = modelInfo.data;
      let userInfo = await this.$axios.get("getUserInfo");
      this.userInfo = userInfo.data;
      //Show the purchase dialogue
      if (this.$route.query["buy"]) {
        this.dialogFormVisible = true;
      }
    },
    buyModel: async function () {
      this.$confirm('Do you really want to buy this model?', 'Model Purchase', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'success'
      }).then(async () => {
        const info = await this.$axios.get('buyModel', {
          params: {
            "id": this.$route.params.id,
          }
        });
        if (info) {
          this.$message.success('Purchase Success, please proceed to process it in your personal center!');
          await this.getModel();
          this.dialogFormVisible = false;
        }
      }).catch(() => {
      });
    }
  },
  data() {
    return {
      modelInfo: {},
      dialogFormVisible: false,
      userInfo:{},
      form: {
        id: 0,
        price:0,
      }
    };
  },
}
</script>

<style scoped>

</style>
