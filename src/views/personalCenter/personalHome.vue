<template>
  <el-container>
    <el-header>
      <div>
        <router-link to="/"><img class="logo" src="../../assets/logo.jpg" alt/></router-link>
        <span>Machine Learning Model Market</span>
      </div>
      <div class="personalInfo">
        <span>Hello, {{ $store.state.userInfo.nickname }}!</span>
        <div style="margin-right:20px">
          <el-button type="info" @click="$router.push('/notifications')" v-if="$store.state.userInfo.notifications==0" icon="el-icon-bell" circle></el-button>
          <el-button type="danger" @click="$router.push('/notifications')" style="width: 40px;height: 40px" v-else circle>{{$store.state.userInfo.notifications}}</el-button>
        </div>
        <el-button type="primary" @click="$router.push('/')">Home Page</el-button>
        <el-button @click="logout">Logout</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="220px">
        <el-menu unique-opened router :default-active="activePath"
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
import getIdentity from "@/store/userInfo";

export default {
  name: 'personalHome',
  async created() {
    await this.getIdentity();
  },
  data() {
    return {
      userInfo: {role: "guest", username: "guest"},
      // 左侧菜单数据
      menuList: [],
    };
  },
  methods: {
    logout: async function () {
      await this.$axios.get("logout");
      this.waitingList.clear();
      this.$router.push("/");
    },
    getIdentity: async function () {
      let userInfo = await getIdentity();
      if (userInfo.role == "user") {
        this.menuList = [
          {
            id: 1,
            path: "/personalModelList",
            authName: "Model Management",
          }, {
            id: 2,
            authName: "Orders",
            children: [
              {
                id: 21,
                path: "/personalOrders",
                authName: "Purchased Orders",
              },
              {
                id: 22,
                path: "/soldOrders",
                authName: "Sold Orders",
              },
            ],
          }, {
            id: 5,
            path: "/viewWaitingList",
            authName: "Waiting List",
          },
          {
            id: 3,
            path: "/modelEnsemble",
            authName: "Model Ensemble",
          }, {
            id: 4,
            authName: "Personal Info",
            children: [
              {
                id: 41,
                path: "/basicInfo",
                authName: "Basic Info",
              },
              {
                id: 42,
                path: "/changePassword",
                authName: "Change Password",
              },
              {
                id: 43,
                path: "/charge",
                authName: "Charge",
              },
            ]
          }];
      } else if (userInfo.role == "manager") {
        this.menuList = [
          {
            id: 1,
            path: "/personalModelList",
            authName: "Model Management",
          }, {
            id: 2,
            authName: "Orders",
            path: "/personalOrders",
          },
          {
            id: 0,
            path: "/userManagement",
            authName: "User Management",
          },
          {
            id: 6,
            path: "/viewLogs",
            authName: "View Logs",
          },
          {
            id: 4,
            authName: "Personal Info",
            children: [
              {
                id: 41,
                path: "/basicInfo",
                authName: "Basic Info",
              },
              {
                id: 42,
                path: "/changePassword",
                authName: "Change Password",
              },
            ]
          }];
      } else {
        this.$message.error('Sorry, you have not logged in or you are not authorised user!');
        this.$router.push("/");
      }
    },
  },
  computed: {
    paths() {
      let paths = [];
      for (let item of this.menuList) {
        if ("path" in item) {
          paths.push(item["path"]);
        }
        if ("children" in item) {
          for (let it of item["children"]) {
            paths.push(it["path"]);
          }
        }
      }
      return paths;
    },
    activePath() {
      if (this.paths.includes(this.$route.path)) {
        return this.$route.path;
      } else {
        return this.$store.state.activePath;
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

.icon-align {
  margin-left: -3px !important;
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
