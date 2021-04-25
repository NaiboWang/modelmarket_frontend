<template>
  <el-container>
    <el-header>
      <div>
        <router-link to="/"><img src="../../assets/logo.jpg" alt /></router-link>
        <span>Machine Learning Model Market</span>

      </div>
      <div class="personalInfo" v-if="userInfo.role !='guest'" >
        <span>Hello, {{userInfo.username}}!</span>
        <el-button type="primary" v-if="userInfo.role =='user'" @click="$router.push('/personalHome')">Personal Center</el-button>
        <el-button type="primary" v-else-if="userInfo.role =='manager'" @click="$router.push('/managementHome')">Management Center</el-button>
        <el-button  @click="logout">Logout</el-button>
      </div>
      <el-button type="primary" v-else @click="$router.push('/login')">Login</el-button>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: 'Home',
  async created() {
    await this.getIdentity();
  },
  data() {
    return {
      userInfo:{role:"guest", username:"guest"},
    };
  },
  methods: {
    logout: async function (){
      await this.$axios.get("logout");
      this.waitingList.clear();
      await this.getIdentity();
    },
    getIdentity: async function(){
      let userInfo = await this.$axios.get("getIdentity");
      this.userInfo = userInfo;
    },
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.personalInfo{
  span{
    margin-right: 20px;
  }
}
.el-header {
  background-color: #373f41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      margin-left: 10px;
      height: 40px;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}


</style>
