<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <router-link to="/"><img  src="../assets/logo.jpg" alt="avatar" /></router-link>
      </div>
      <h2>Login</h2>
      <!-- 登录表单 -->
      <div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="60px"
          class="login_form"
        >
          <el-form-item label="Username" prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="pass">
            <el-input
              v-model="loginForm.pass"
              type="password"
              prefix-icon="iconfont icon-3702mima"
              v-on:keyup.enter="login"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login" v-on:keyup.enter="login">Login</el-button>
            <el-button @click="registerForm">Register</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loginForm: {
        username: 'provider',
        pass: 'qq',
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: 'Please enter username', trigger: 'blur' },
          { min: 2, max: 10, message: 'Username should between 2 to 10 characters', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: 'Please enter password', trigger: 'blur' },
          { min: 2, max: 18, message: 'Password should between 2 to 18 characters', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单重置按钮
    registerForm () {
      this.$router.push("/register");
    },
    login () {
      // 表单预验证
      // valid：bool类型
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return false;
        }
        const info = await this.$axios.post('login', this.loginForm);
        if(info){
          this.$router.push(this.$store.state.backRef);
        }
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
  top: 40%;
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
    transform: translate(-30%, -70%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  h2{
    transform: translate(0%, 200%);
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

:deep(.el-form-item__error)
{
  margin-left: 60px;
}

.el-input
{
  margin-left: 30px;
  width: 80%;
}
</style>
