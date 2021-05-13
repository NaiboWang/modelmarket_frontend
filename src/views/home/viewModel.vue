<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">Home Page</el-breadcrumb-item>
    <el-breadcrumb-item>Model Details</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>


    <el-row>
      <el-col :span="6"></el-col>
      <el-col :span="12" style="text-align: left">
        <h2 style="text-align: center">Model Details</h2>
        <table style="margin:0 auto">
          <tr>
            <td style="text-align: right">Model Name:</td>
            <td>{{ modelInfo["modelName"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Model Author:</td>
            <td>{{ modelInfo["author"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Model Framework:</td>
            <td>{{ modelInfo["modelFramework"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Model Description:</td>
            <td style="word-wrap: break-word;word-break: break-all;overflow: hidden;max-height: 100px;">
              {{ modelInfo["modelDescription"] }}
            </td>
          </tr>
          <tr>
            <td style="text-align: right">Tags:</td>
            <td style="word-wrap: break-word;word-break: break-all;overflow: hidden;max-height: 100px;">
              <el-tag
                  v-for="(item, i) in modelInfo['tags']"
                  :key="i"
              >{{ item }}
              </el-tag>
            </td>
          </tr>
          <!--          <tr>-->
          <!--            <td width="200px" style="text-align: right">Model File Name:</td>-->
          <!--            <td>{{ modelInfo["filename"] }}</td>-->
          <!--          </tr>-->
          <tr>
            <td style="text-align: right">Update Time:</td>
            <td>{{ modelInfo["updated_time"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Create Time:</td>
            <td>{{ modelInfo["created_time"] }}</td>
          </tr>
          <tr>
            <td style="text-align: right">Model Structure:</td>
            <td>
              <el-image
                  :src="clickToSee"
                  :preview-src-list="[picURL]"
                  fit="scale-down">
                <template #error>
                  <div class="image-slot">
                    Sorry but the we didn't find the structure picture!
                  </div>
                </template>
              </el-image>
            </td>
          </tr>
          <tr>
            <td style="text-align: right">Model Price:</td>
            <td style="color:blue;font-size:20px">SGD {{ modelInfo["price"] }}</td>
          </tr>
        </table>
        <div style="text-align: center;margin-top: 15px">
          <el-button type="warning" icon="el-icon-shopping-cart-2" size="medium" @click="dialogFormVisible = true">Buy
            Model
          </el-button>
        </div>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </el-card>
  <el-dialog title="Buy Model" v-model="dialogFormVisible" @open="getUserInfo">
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
      this.picURL = this.staticURL + 'pics/' + modelInfo.data["structurePic"];
      //Show the purchase dialogue
      if (this.$route.query["buy"] == "true") {
        this.dialogFormVisible = true;
      }
    },
    getUserInfo: async function () {
      let userInfo = await this.$axios.get("getUserInfo");
      //注意这里，前端代码里不能有值读取不了的情况，否则整个系统都会崩掉！
      if (userInfo) {
        this.userInfo = userInfo.data;
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
      clickToSee: this.staticURL + 'pics/click.png',
      userInfo: {
        "deposit": 0,
      },
      picURL:"",
      form: {
        id: 0,
        price: 0,
      }
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
