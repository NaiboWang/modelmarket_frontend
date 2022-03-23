<template>
  <el-row :class="classes">
    <el-col :span="6" style="margin-right:10px">
      <el-select style="width: 100%" v-model="searchDict.fields" @change="detectChange" multiple
                 placeholder="Please choose query fields">
        <el-option
            v-for="item in searchDict.queryFields"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </el-col>

    <el-col :span="10">
      <!--        注意下面js函数默认传参，与python不同！第一个参数必须显式指定为undefined，不能省略！省略会把第二个参数activesearch的true赋值给函数的第一个参数！-->
      <el-input v-model="searchDict.query" @keyup.enter="getData(undefined,activeSearch=true)"
                placeholder="please input keywords to search"
                clearable>
        <template #append>
          <el-button @click="getData(undefined,activeSearch=true)" icon="el-icon-search"></el-button>
        </template>
      </el-input>
    </el-col>
    <el-col :span="1">
      <el-button @click="dialogFormVisible=true" type="primary" plain style="margin-left: 5px">Advanced Search
      </el-button>
    </el-col>
  </el-row>
  <slot>Put your tables here</slot>
  <!-- 分页区域 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchDict.queryInfo.pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="searchDict.queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchDict.total"
      background
  ></el-pagination>
  <el-dialog title="Advanced Search" v-model="dialogFormVisible">
    <el-form>
      <el-form-item v-for="queryField in searchDict.queryFields" :label="queryField.label+' '+queryField.comment"
                    :key="queryField.label"
                    prop="queryField.value">

        <el-input v-model="searchDict.queryInfo.multiConditions[queryField.value]" v-if="queryField.type=='text'"
                  autocomplete="off"></el-input>
        <!--number-->
        <div v-if="queryField.type=='number'" style="width: 100%">
          <el-input v-model="searchDict.queryInfo.multiConditions[queryField.value +'_from']" style="width: 49%"
                    placeholder="From"
                    type="number" autocomplete="off"></el-input>
          <el-input v-model="searchDict.queryInfo.multiConditions[queryField.value +'_to']"
                    style="width: 49%; float: right"
                    placeholder="To"
                    type="number" autocomplete="off"></el-input>
        </div>

        <!--datetime-->
        <div v-if="queryField.type=='datetime'" style="width: 100%">
          <el-input v-model="searchDict.queryInfo.multiConditions[queryField.value +'_from']" style="width: 47%"
                    placeholder="From"
                    type="datetime-local" autocomplete="off"></el-input>
          <label style="width: 4%;margin-left: 2%">To</label>
          <el-input v-model="searchDict.queryInfo.multiConditions[queryField.value +'_to']"
                    style="width: 47%; float: right"
                    placeholder="To"
                    type="datetime-local" autocomplete="off"></el-input>
        </div>

      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="getData(advance=1,activeSearch=true)">Search</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
// 使用方式：
// 1. 在data中定义searchData和searchParams变量，前者用来存储查询的数据，后者是传给搜索框的参数：
//       searchData: [],
//       searchParams: {
//           queryFields: [
//     {
//       label: 'Model Name',//显示出的名称
//       value: 'modelName',//实际对应数据库的字段名称
//       type: 'text',//字段类型
//       comment: '',//字段说明
//     },
//     {
//       label: 'Price',
//       value: 'price',
//       type: 'number',
//       comment: '',
//     },
//     {
//       label: 'Update Time',
//       comment: ' (must specify time, not only date)',
//       value: 'updated_time',
//       type: 'datetime',
//     },
//   ], //定义可查询的字段
//       apiAddress: 'queryModels',//查询的api地址
//       sortProp: "updated_time",//默认排序字段
//       defaultSearchProp: "modelName",//默认查询字段
// },
//
// 2. 使用插件：
// 在<search-box></search-box>之间插入表格，
// 定义get-data为箭头函数用来将查询到的数据赋值给data
//     同时sort-change函数定义一个如下的箭头函数用来赋值排序数据
//    <search-box :params="searchParams" @get-data="(data) => searchData = data" ref="searchBox">
// <el-table ref="tableRef" :data="searchData" @sort-change="(column) => $refs.searchBox.sortData(column)" border stripe class="center_layout">
// <el-table-column header-align="center" align="center" label="ID" type="index"></el-table-column>
// <el-table-column :sortable="'custom'" header-align="center" align="center" label="Name"
// prop="modelName"></el-table-column>
// </el-table-column>
// </el-table>
// </search-box>
import {convert_time} from "@/utils/time";

export default {
  name: "SearchBox",
  emits:['getData'], //标记事件名称
  async mounted() {
    if("additionalConditions" in this.params){
      this.searchDict.queryInfo.additionalConditions = JSON.stringify(this.params.additionalConditions);
    }
    this.searchDict.queryFields = this.params.queryFields;
    for (let item of this.searchDict.queryFields) {
      if (item.type == 'number' || item.type == 'datetime') {
        this.searchDict.queryInfo.multiConditions[item.value + '_from'] = '';
        this.searchDict.queryInfo.multiConditions[item.value + '_to'] = '';
      } else {
        this.searchDict.queryInfo.multiConditions[item.value] = '';
      }
    }
    this.searchDict.queryInfo.pageSize = this.pageSize;
    this.searchDict.queryInfo.sortProp = this.params.sortProp;
    this.searchDict.fields.push(this.params.defaultSearchProp);
    await this.getData();
  },
  props: {
    params:{
      required:true,
    },
    pageSize: {
      default: 10,
    },
    classes:{
      default: "",
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      searchDict: {
        query: '',
        fields: [],
        queryInfo: {
          pageNum: 1,
          pageSize: 10,
          sortProp: "",
          order: -1,
          advance: 0,
          multiConditions: {},
          additionalConditions:{},
        },
        queryFields: [],
        total: 0,
      }
    }
  },
  methods: {
    detectChange(values) {
      //全部删除选项时恢复默认选项
      if (values.length == 0) {
        this.searchDict.fields = [];
        this.searchDict.fields.push(this.params.defaultSearchProp);
      }
    },
    // 分页
    handleSizeChange(newSize) {
      this.searchDict.queryInfo.pageSize = newSize;
      this.getData();
    },
    handleCurrentChange(newSize) {
      this.searchDict.queryInfo.pageNum = newSize;
      this.getData();
    },
    sortData: async function (column) {
      //默认排序元素
      if (column.prop == null) {
        this.searchDict.queryInfo.sortProp = 'updated_time';
      } else {
        this.searchDict.queryInfo.sortProp = column.prop;
      }
      this.searchDict.queryInfo.pageNum = 1; //排序后回到第一页
      this.searchDict.queryInfo.order = column.order == "ascending" ? 1 : -1;
      await this.getData();
    },
    getData: async function (advance = 0, activeSearch = false) {
      if (this.searchDict.fields.length == 0) {
        this.$message.error("Please select at least one query field!");
        return false;
      }
      if (activeSearch) {
        this.searchDict.queryInfo.advance = advance;
        this.searchDict.queryInfo.pageNum = 1;
      }
      let queryInfo = this.$lodash.clone(this.searchDict.queryInfo);
      queryInfo.queryFields = JSON.stringify(this.searchDict.queryFields);
      queryInfo.multiConditions = JSON.stringify(queryInfo.multiConditions);
      if (this.searchDict.queryInfo.advance == 1) {
        queryInfo.query = '';
      } else {
        queryInfo.query = this.searchDict.query;
      }
      queryInfo.fields = [];
      for (let field of this.searchDict.fields) {
        let type = "text";
        for (let item of this.searchDict.queryFields) {
          if (item.value == field) {
            type = item.type;
            break;
          }
        }
        queryInfo.fields.push({name: field, type: type, query: queryInfo.query});
      }
      queryInfo.fields = JSON.stringify(queryInfo.fields);
      let data = await this.$axios.post(this.params.apiAddress, queryInfo);
      convert_time(data);
      this.searchDict.total = data.total;
      this.dialogFormVisible = false;
      this.$emit("getData",data.data);
    },
  },
}
</script>

<style scoped>
.el-form {
  text-align: left;
}

:deep(.el-form-item__label) {
  text-align: left !important;
  float: initial !important;
}
</style>
