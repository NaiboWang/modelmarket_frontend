<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">{{$store.state.userRole=='user'?'Personal Center':'Management Center'}}</el-breadcrumb-item>
    <el-breadcrumb-item>Personal Info</el-breadcrumb-item>
    <el-breadcrumb-item>Change Password</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <h3>Change Password</h3>
    <!-- 改密码表单 -->
    <div class="form_center_layout">
      <el-form
          ref="changePasswordFormRef"
          :model="changePasswordForm"
          :rules="changePasswordFormRules"
          label-width="130px"
      >
        <el-form-item label="Old Password" prop="oldPass">
          <el-input v-model="changePasswordForm.oldPass" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="pass">
          <el-input
              v-model="changePasswordForm.pass"
              type="password"
              prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item label="ConfirmPass" prop="confirmPass">
          <el-input
              v-model="changePasswordForm.confirmPass"
              type="password"
              prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="changePass">Change</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "changePassword",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter password'));
      } else {
        if (this.changePasswordForm.confirmPass !== '') {
          this.$refs.changePasswordFormRef.validateField('confirmPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter password again'));
      } else if (value !== this.changePasswordForm.pass) {
        callback(new Error('The two passwords do not match!'));
      } else {
        callback();
      }
    };
    return {
      changePasswordForm: {
        oldPass: '',
        pass: '',
        confirmPass: '',
      },
      // 表单验证
      changePasswordFormRules: {
        oldPass: [
          {required: true, message: 'Please enter your old password', trigger: 'blur'},
          {min: 2, max: 18, message: 'The length of password should between 2 to 18 characters', trigger: 'blur'}
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'},
          {required: true, message: 'Please enter new password', trigger: 'blur'},
          {min: 2, max: 18, message: 'The length of password should between 2 to 18 characters', trigger: 'blur'}
        ],
        confirmPass: [
          {validator: validatePass2, trigger: 'blur'},
          {required: true, message: 'Please enter password', trigger: 'blur'},
        ],
      }
    }
  },
  methods:{
    changePass () {
      // 表单预验证
      // valid：bool类型
      this.$refs.changePasswordFormRef.validate(async valid => {
        if (!valid) {
          return false;
        }
        this.$confirm('Do you really want to change your password?', 'Change Password', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'success'
        }).then(async () => {
          const info = await this.$axios.post('changePassword', this.changePasswordForm);
          if(info){
            this.$router.push("/login");
          }
        }).catch(() => {});
      })
    }
  }
}
</script>

<style scoped>
.el-card
{
  min-height: 630px;
}
</style>
