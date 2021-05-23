<template>
  <el-container>
    <el-header>
      <div>
        <router-link to="/"><img class="logo" src="../../assets/logo.jpg" alt /></router-link>
        <span>Machine Learning Model Market</span>

      </div>
      <div class="personalInfo" v-if="$store.state.userInfo.role !='guest'" >
        <span>Hello, {{$store.state.userInfo.nickname}}!</span>
        <el-button type="primary" @click="$router.push('/personalHome')">{{$store.state.userInfo.role =='manager'?'Management Center':'Personal Center'}}</el-button>
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
import getIdentity from "@/store/userInfo";
export default {
  name: 'Home',
  async created() {
    await getIdentity();
  },
  data() {
    return {
    };
  },
  methods: {
    logout: async function (){
      await this.$axios.get("logout");
      this.waitingList.clear();
      await getIdentity();
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
    span {
      margin-left: 15px;
    }
  }
}


</style>
