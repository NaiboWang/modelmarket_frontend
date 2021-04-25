<template>
  <el-container>
    <el-header>
      <div>
        <router-link to="/"><img src="../../assets/logo.jpg" alt/></router-link>
        <span>Machine Learning Model Market</span>
      </div>
      <div class="personalInfo">
        <span>Hello, {{ userInfo.username }}!</span>
        <el-button type="primary" @click="$router.push('/')">Home Page</el-button>
        <el-button @click="logout">Logout</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="220px">
        <el-menu unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath"
                 background-color="#333744" text-color="#fff" active-text-color="#409FFF">
          <!-- :unique-opened="true"->只允许展开一个菜单 -->
          <!-- :collapse-transition="false" -> 关闭动画 -->
          <!-- router -> 导航开启路由模式 -->
          <!-- 一级菜单  -->
          <div v-for="item in menuList" :key="item.id">
            <el-menu-item style="text-align: left; margin-left:5px " v-if="!item.children" :index="item.path+''">
              <!-- 一级菜单的模板区域 -->
              <i :class="$store.state.iconObj[item.id]"></i>
              <template #title>
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
            <el-submenu v-else style="text-align: left; margin-left:5px " :index="item.authName">
              <template #title>
                <i :class="$store.state.iconObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.id"
                            style="padding-left:25px">
                <template #title>
                  <i :class="$store.state.iconObj[child.id]"></i>
                  <span>{{ child.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: 'managementHome',
  async created() {
    await this.getIdentity();
  },
  data() {
    return {
      userInfo: {role: "guest", username: "guest"},
      // 默认不折叠
      isCollapse: false,
      // 左侧菜单数据
      menuList: [{
        id: 1,
        path: "/managementModels",
        authName: "Model Management",
      }, {
        id: 2,
        authName: "Orders",
        children:[
          {
            id:21,
            path:"/",
            authName:"Purchased Orders",
          },
          {
            id:22,
            path:"/",
            authName:"Sold Orders",
          },
        ],
      }, {
        id: 4,
        authName: "Personal Info",
        children: [
          {
            id:41,
            path:"/managementInfo",
            authName:"Basic Info",
          },
          {
            id:42,
            path:"/managementPassword",
            authName:"Change Password",
          },
        ]
      }],
    };
  },
  methods: {
    logout: async function () {
      await this.$axios.get("logout");
      this.waitingList.clear();
      this.$router.push("/");
    },
    getIdentity: async function () {
      let userInfo = await this.$axios.get("getIdentity");
      if (userInfo.role != "manager") {
        this.$message.error('Sorry, you have not logged in or you are not authorised user!');
        this.$router.push("/");
      }
      this.userInfo = userInfo;
    },
  },
  computed:{
    paths() {
      let paths = [];
      for(let item of this.menuList){
        if("path" in item)
        {
          paths.push(item["path"]);
        }
        if("children" in item){
          for(let it of item["children"]){
            paths.push(it["path"]);
          }
        }
      }
      return paths;
    },
    activePath(){
      if(this.paths.includes(this.$route.path)){
        return this.$route.path;
      }else{
        return this.$store.state.activeManagementPath;
      }
    },
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
  min-height: 700px;
}

.personalInfo {
  span {
    margin-right: 20px;
  }
}

.icon-align{
  margin-left:-3px!important;
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
      height: 40px;
    }

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}

</style>
