<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <router-link to="/"><img src="../assets/logo.jpg" alt="avatar"/></router-link>
      </div>
      <h2>Register</h2>
      <!-- 登录表单 -->
      <div style="margin-top: 20px">
        <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerFormRules"
            label-width="60px"
            class="login_form"
        >
          <el-form-item label="Username" prop="username">
            <el-input v-model="registerForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="pass">
            <el-input
                v-model="registerForm.pass"
                type="password"
                prefix-icon="iconfont icon-3702mima"
            ></el-input>
          </el-form-item>
          <el-form-item label="ConfirmPass" prop="confirmPass">
            <el-input
                v-model="registerForm.confirmPass"
                type="password"
                prefix-icon="iconfont icon-3702mima"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="register" v-on:keyup.enter="register">Register!</el-button>
            <el-button @click="returnLogin">Return to Login</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter password'));
      } else {
        if (this.registerForm.confirmPass !== '') {
          this.$refs.registerFormRef.validateField('confirmPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter password again'));
      } else if (value !== this.registerForm.pass) {
        callback(new Error('The two passwords do not match!'));
      } else {
        callback();
      }
    };
    var validateUsername = (rule, value, callback) => {
      if (value.includes(' ')) {
        callback(new Error('User name cannot contain space'));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        username: '',
        pass: '',
        confirmPass: '',
      },
      // 表单验证
      registerFormRules: {
        username: [
          {validator: validateUsername, trigger: 'blur'},
          {required: true, message: 'Please enter username', trigger: 'blur'},
          {min: 2, max: 10, message: 'Username should between 2 to 10 characters', trigger: 'blur'}
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'},
          {required: true, message: 'Please enter password', trigger: 'blur'},
          {min: 2, max: 18, message: 'Password should between 2 to 18 characters', trigger: 'blur'}
        ],
        confirmPass: [
          {validator: validatePass2, trigger: 'blur'},
          {required: true, message: 'Please enter password', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    returnLogin() {
      this.$router.push("/login");
    },
    register() {
      // 表单预验证
      // valid：bool类型

      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) {
          return false;
        }
        this.$confirm('Do you really want to register?', 'Register', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'success'
        }).then(async () => {
          const info = await this.$axios.post('register', this.registerForm);
          if (info) {
            this.$message.success('Register Success, please log in!');
            this.$router.push("/login");
          }
        }).catch(() => {
        });

        // this.$router.push('/home');
      })
    }
  }
}
</script>

<style lang="less" scoped>
/* // lang="less" 支持less格式
// scoped vue的指令，只在当前组件生效 */
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 360px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-60%, -50%);
  background-color: #fff;

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-30%, -100%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  h2 {
    text-align: center;
    margin-left: 50px;
    margin-top: 10px;
  }
}

.login_form {
  position: absolute;
  bottom: 60px;
  width: 100%;
  padding: 0 20px;
  margin-top: 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: center;
}

.info {
  font-size: 13px;
  margin: 10px 15px;
}

.el-input {
  margin-left: 30px;
  width: 80%;
}
:deep(.el-form-item__error)
{
  margin-left: 60px;
}
</style>
