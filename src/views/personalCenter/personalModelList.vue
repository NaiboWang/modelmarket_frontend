<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">
      {{ $store.state.userInfo.role == 'user' ? 'Personal Center' : 'Management Center' }}
    </el-breadcrumb-item>
    <el-breadcrumb-item>Model Management</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <search-box :params="searchParams" @get-data="(data) => searchData = data" ref="searchBox">
      <!-- 表格数据 -->
      <el-table ref="tableRef" :data="searchData" @sort-change="(column) => $refs.searchBox.sortData(column)" border
                stripe class="left_layout">
        <el-table-column header-align="center" :sortable="'custom'" align="center" label="ID"
                         type="index"></el-table-column>
        <el-table-column header-align="center" :sortable="'custom'" align="center" label="Name"
                         prop="modelName"></el-table-column>
        <el-table-column header-align="center" v-if="$store.state.userInfo.role == 'manager'" :sortable="'custom'"
                         align="center" label="Author" prop="author"></el-table-column>
        <el-table-column header-align="center" align="center" label="Tags">
          <template v-slot="scope">
            <el-tag
                v-for="(item, i) in scope.row.tags"
                :key="i"
            >{{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" :sortable="'custom'" label="FrameWork"
                         prop="modelFramework"
                         width="130px"></el-table-column>
        <el-table-column :sortable="'custom'" header-align="center" align="center" label="Price" prop="price"
                         width="130px"></el-table-column>
        <el-table-column :sortable="'custom'" header-align="center" align="center" label="Update Time"
                         prop="updated_time"
                         width="160px"></el-table-column>
        <!--      <el-table-column :sortable="'custom'" header-align="center" align="center" label="Create Time" prop="created_time"-->
        <!--                       width="200px"></el-table-column>-->
        <el-table-column header-align="center" align="center" :sortable="'custom'" label="Status" prop="status"
                         width="110px">
          <template v-slot="scope">
            <!--          <span style="color:blue" v-if="scope.row.status==true">Normal</span>-->
            <!--          <span v-else>Disabled</span>-->
            <el-switch @change="changeModelStatus(scope.row,scope.row.id,scope.row.status)" v-model="scope.row.status">
            </el-switch>
          </template>

        </el-table-column>
        <el-table-column v-if="$store.state.userInfo.role == 'user'" header-align="center" align="center"
                         label="Operations" width="220px">
          <template v-slot="scope">
            <el-button type="primary" :icon="$store.state.userInfo.role == 'user'?'el-icon-edit':'el-icon-view'"
                       size="medium"
                       @click="editModel(`${scope.row.id}`)">
              {{ $store.state.userInfo.role == 'user' ? "View/Edit" : "View" }}
            </el-button>
            <!--          <el-popconfirm-->

            <!--              confirmButtonText='Yes'-->
            <!--              cancelButtonText='No'-->
            <!--              icon="el-icon-info"-->
            <!--              iconColor="red"-->
            <!--              title="Do you really want to disable this model?"-->
            <!--              @confirm='deleteModel(`${scope.row.id}`)'-->
            <!--          >-->
            <!--            <template  #reference>-->
            <!--              <el-button-->
            <!--                  type="info"-->
            <!--                  icon="el-icon-turn-off"-->
            <!--                  size="medium"-->
            <!--              >Disable-->
            <!--              </el-button>-->
            <!--            </template>-->
            <!--          </el-popconfirm>-->
          </template>
        </el-table-column>
        <el-table-column v-else header-align="center" align="center" label="Operations" width="150px">
          <template v-slot="scope">
            <el-button type="primary" :icon="$store.state.userInfo.role == 'user'?'el-icon-edit':'el-icon-view'"
                       size="medium"
                       @click="editModel(`${scope.row.id}`)">
              {{ $store.state.userInfo.role == 'user' ? "View/Edit" : "View" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </search-box>

    <el-row>
      <el-col v-if="$store.state.userInfo.role=='user'" :span="6">
        <el-button style="float: left" type="primary" @click="$router.push('/manageModel/-1')">New Model</el-button>
      </el-col>
    </el-row>

  </el-card>
</template>

<script>
export default {
  name: "personalModelList",
  async created() {
    if (this.$store.state.userInfo.role == "manager") {
      this.searchParams.queryFields.push({
        label: 'Author',
        value: 'author', type: 'text', comment: ''
      });
    }
  },
  data() {
    return {
      searchData: [],
      searchParams: {
        queryFields: [
          {
            label: 'Model Name',
            value: 'modelName',
            type: 'text',
            comment: '',
          },
          {
            label: 'Framework',
            value: 'modelFramework',
            type: 'text',
            comment: '',
          },
          {
            label: 'Price',
            value: 'price',
            type: 'number',
            comment: '',
          },
          {
            label: 'Tag',
            value: 'tags',
            type: 'text',
            comment: '',
          },
          {
            label: 'Update Time',
            comment: ' (must specify time, not only date)',
            value: 'updated_time',
            type: 'datetime',
          },
        ],
        apiAddress: 'queryModelsManagement',
        sortProp: "updated_time",
        defaultSearchProp: "modelName",
      },
    };
  },
  methods: {
    editModel(id) {
      let newPage = this.$router.resolve({
        path: '/manageModel/' + id,
      })
      window.open(newPage.href, '_blank');
    },
    deleteModel: async function (id) {
      await this.$axios.get("deleteModel", {
        params: {
          "id": id,
        }
      });
      await this.getModels();
    },
    changeModelStatus: async function (row, id, status) {
      let info = await this.$axios.get("changeModelStatus", {
        params: {
          "id": id,
          "status": status,
        }
      });
      if (!info) {
        row.status = !status;
      }
    }
  },
}
</script>

<style scoped>
.el-tag {
  margin-right: 8px;
  margin-top: 2px;
}
</style>
