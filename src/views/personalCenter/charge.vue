<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">{{$store.state.userRole=='user'?'Personal Center':'Management Center'}}</el-breadcrumb-item>
    <el-breadcrumb-item>Personal Info</el-breadcrumb-item>
    <el-breadcrumb-item>Charge</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <h3>Charge</h3>
    <div class="form_center_layout">
      <el-form :model="userInfo" ref="userInfoFormRef"
               :rules="userInfoFormRules" label-width="170px">
        <el-form-item label="Username" prop="username">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="Deposit (SGD)" prop="deposit">
          <el-input v-model="userInfo.deposit" disabled></el-input>
        </el-form-item>
        <el-form-item label="Charge Amount (SGD):" prop="chargeAmount">
          <el-input v-model.number="userInfo.chargeAmount"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="charge">Charge!</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "charge",
  async created() {
    await this.getInfo();
  },
  data() {
    const checkAmount = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('Please input Integer'));
      } else {
        if (value <= 0) {
          callback(new Error('The amount must be greater than 0'));
        } else {
          callback();
        }
      }
    };
    return {
      userInfo: {
        username: "",
        deposit: 0,
        chargeAmount: 100,
      },
      userInfoFormRules: {
        chargeAmount: [
          {validator: checkAmount, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    charge: function () {
      this.$refs.userInfoFormRef.validate(async valid => {
        if (!valid) {
          return false;
        }
        this.$confirm(`Do you really want to charge SGD ${this.userInfo.chargeAmount}?`, 'Charge Confirm', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'success'
        }).then(async () => {
          const info = await this.$axios.get('charge', {
            params: {
              "amount": this.userInfo.chargeAmount,
            }
          });
          if (info) {
            this.$message.success('Charge Success!');
            await this.getInfo();
          }
        }).catch(() => {
        });
      })
    },
    getInfo: async function () {
      const info = await this.$axios.get('getUserInfo');
      this.userInfo = info.data;
      this.userInfo.chargeAmount = 100;
    }
  }
}
</script>

<style scoped>
</style>
