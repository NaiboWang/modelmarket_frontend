<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">Home Page</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <h2>Welcome to Machine Learning Model Market!</h2>
    <search-box :params="searchParams" @get-data="(data) => searchData = data" ref="searchBox" classes="center_layout">
      <el-table ref="tableRef" :data="searchData" @sort-change="(column) => $refs.searchBox.sortData(column)" border stripe class="center_layout">
        <el-table-column header-align="center" align="center" label="ID" type="index"></el-table-column>
        <el-table-column :sortable="'custom'" header-align="center" align="center" label="Name"
                         prop="modelName"></el-table-column>
        <el-table-column :sortable="'custom'" header-align="center" align="center" label="Author"
                         prop="nickname"></el-table-column>
        <el-table-column :sortable="'custom'" header-align="center" align="center" label="FrameWork"
                         prop="modelFramework"
                         width="130px"></el-table-column>
        <el-table-column :sortable="'custom'" header-align="center" align="center" label="Price" prop="price"
                         width="130px"></el-table-column>
        <el-table-column :sortable="'custom'" header-align="center" align="center" label="Update Time"
                         prop="updated_time"
                         width="160px"></el-table-column>
        <el-table-column header-align="center" align="center" label="Tags">
          <template v-slot="scope">
            <el-tag
                v-for="(item, i) in scope.row.tags"
                :key="i"
            >{{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="Operations" width="280px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-view" size="medium"
                       @click="viewModel(`${scope.row.id}`)">View
            </el-button>
            <el-button
                type="warning"
                icon="el-icon-shopping-cart-2"
                size="medium"
                @click="viewModel(`${scope.row.id}`,true)"
            >Buy
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </search-box>
  </el-card>
</template>

<script>
export default {
  name: "modelList",
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
            label: 'Author',
            value: 'nickname',
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
            comment: ' (Must specify time, not only date)',
            value: 'updated_time',
            type: 'datetime',
          },
        ],
        apiAddress: 'queryModels',
        sortProp: "updated_time",
        defaultSearchProp: "modelName",
      },
    };
  },
  methods: {
    viewModel(id, buy = false) {
      let newPage = this.$router.resolve({
        path: '/viewModel/' + id,
        query: {
          buy: buy,
        },
      })
      window.open(newPage.href, '_blank');
    },
  },
}
</script>

<style scoped>
.el-table th.gutter {
  display: table-cell !important;
}

.el-form {
  text-align: left;
}

:deep(.el-form-item__label) {
  text-align: left !important;
  float: initial !important;
}
</style>
