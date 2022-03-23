<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">Home Page</el-breadcrumb-item>
    <el-breadcrumb-item>Model Information</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row>
      <el-tabs tab-position="left">
        <el-tab-pane label="Model Information" style="text-align: left">

          <h2 style="text-align: center">Model Information</h2>
          <div class="content">
            <div>
              <p class="title">Model Name</p>
              <p>{{ modelInfo["modelName"] }}</p>
            </div>
            <div>
              <p class="title">Author</p>
              <p>{{ modelInfo["author"] }}</p>
            </div>
            <div>
              <p class="title">Original Framework</p>
              <p>{{ modelInfo["modelFramework"] }}</p>
            </div>
<!--            <div>-->
<!--              <p class="title">Description</p>-->
<!--              <p>{{ modelInfo["modelDescription"] }}</p>-->
<!--              <p v-if='modelInfo["modelDescription"]==""'>No description.</p>-->
<!--            </div>-->
            <div>
              <p class="title">Tags</p>
              <div>
                <el-tag
                    v-for="(item, i) in modelInfo['tags']"
                    :key="i"
                    style="margin-top:20px"
                >{{ item }}
                </el-tag>
                <p v-if="!tag">No tags</p>
              </div>
            </div>
            <div>
              <p class="title">Model Price</p>
              <p style="color:blue;font-size:20px">SGD {{ modelInfo["price"] }}</p>
              <el-button type="warning" icon="el-icon-shopping-cart-2" size="medium"
                         @click="dialogFormVisible = true">Buy
                Model
              </el-button>
            </div>
            <div>
              <div class="title">Model Structure (Click to Zoom)</div>
              <div style="margin-top:20px">
                <el-link type="primary" target="_blank"
                         v-if="picURL && picURL.indexOf('undefined')<0 && picURL.indexOf('301')<0" :underline="false"
                         :href="picURL">
                  <el-image
                      :src="picURL"
                      style="max-height:250px;overflow: auto"
                      fit="scale-down">
                  </el-image>
                </el-link>
                <div v-else>
                  Sorry, the model structure is unavailable.
                </div>
              </div>
            </div>
            <div>
              <p class="title">Original Framework</p>
              <p>{{ modelInfo["modelFramework"] }}</p>
            </div>
            <div>
              <p class="title">Update Time</p>
              <p>{{modelInfo["updated_time"] }}</p>
            </div>
            <div>
              <p class="title">Create Time</p>
              <p>{{ modelInfo["created_time"] }}</p>
            </div>
            <div>

              <p class="title" style="margin-bottom: 5px">Descriptions</p>
              <p v-if='modelInfo["howToRunAndDetails"]==""||modelInfo["howToRunAndDetails"]=="\n"'>No other
                details</p>
            </div>
            <div>

            </div>
            <div id="preview" style="padding-left:0"></div>
            <!--          <div id="outline"></div>-->
          </div>

        </el-tab-pane>
        <el-tab-pane label="Files">
          <h2 style="text-align: center">File List</h2>
          <div class="content">
            <el-table ref="tableFileRef" empty-text="No files" :data="fileList" stripe >
              <!--                <el-table-column header-align="center" align="center" label="ID" type="index"></el-table-column>-->
              <el-table-column header-align="left" align="left" label="File Name" prop="name" min-width="400px">
                <template v-slot="scope">
                  <el-link type="primary" :underline="false" :icon="scope.row['type']=='file'?'el-icon-document':'el-icon-folder'" target="_blank"
                           style="float:left;font-size:1.15em;" class="file_style"
                           :href="$rootURL+'model_files/'+scope.row['location']">
                    <span :style="{'font-weight':scope.row.name==maxFileName?'600':'200'}">{{ scope.row.name }}</span>
                  </el-link>

                </template>
              </el-table-column>
              <el-table-column header-align="left" align="left" label="Size"
                               prop="size" min-width="200px">
                <template v-slot="scope">
                  <span
                      :style="{'font-weight':scope.row.name==maxFileName?'600':'200'}">{{ renderSize(scope.row['size']) }}</span>
                </template>

              </el-table-column>
              <el-table-column header-align="left" align="left" label="Update Time"
                               prop="mtime"
                               min-width="360px" ></el-table-column>

            </el-table>


          </div>
        </el-tab-pane>

        <el-tab-pane label="Issues/Discussions">
          <h2 style="text-align: center">Issues/Discussions</h2>
          <div class="content">
            <search-box :params="searchParams" @get-data="getDiscussions" ref="searchBox" classes="center_layout">
              <el-table empty-text="No Issues/Discussions" ref="tableRef" :data="searchData" @sort-change="(column) => $refs.searchBox.sortData(column)"
                        border stripe class="center_layout">
                <el-table-column header-align="center" align="center" label="ID" type="index"></el-table-column>
                <el-table-column :sortable="'custom'" header-align="center" align="center" label="Title" prop="title">
                  <template v-slot="scope">
                    <el-link type="primary" :underline="false" target="_blank" class="discussion_title" style="float:left;"
                             :href="'Discussion/'+scope.row['_id']['$oid']">
                      {{ scope.row.title }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column :sortable="'custom'" header-align="center" align="center" label="Author"
                                 prop="nickname" width="200px"></el-table-column>
                <el-table-column :sortable="'custom'" header-align="center" align="center" label="Update Time"
                                 prop="update_time"
                                 width="160px"></el-table-column>
                <el-table-column :sortable="'custom'" header-align="center" align="center" label="Create Time"
                                 prop="create_time"
                                 width="160px"></el-table-column>
              </el-table>
            </search-box>
            <div class="center_layout">
              <el-button type="primary" @click="dialogFormVisibleTopic=true" style="float:left;margin-top: 20px">New Issue/Discussion
              </el-button>
            </div>

          </div>
        </el-tab-pane>

      </el-tabs>

    </el-row>
  </el-card>
  <el-dialog title="Buy Model" v-model="dialogFormVisible" @open="getUserInfo">
    <el-form :model="form">
      <el-form-item label="Model Name">
        <el-input v-model="modelInfo.modelName" autocomplete="off" disabled style="color:black"></el-input>
      </el-form-item>
      <el-form-item label="Price (SGD)">
        <el-input v-model="modelInfo.price" autocomplete="off" disabled style="color:black"></el-input>
      </el-form-item>
      <el-form-item label="Your Deposit (SGD)">
        <el-input v-model="userInfo.deposit" autocomplete="off" disabled style="color:black"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="buyModel">Buy!</el-button>
      <el-button @click="dialogFormVisible = false">Cancel</el-button>
    </span>
    </template>
  </el-dialog>
  <el-dialog title="New Topic" v-model="dialogFormVisibleTopic" @opened="newTopic">
    <div v-if="$store.state.userInfo.role!='guest'">
      <el-form :model="topic">
        <el-form-item label="Title">
          <el-input v-model="topic.title" autocomplete="off" style="color:black"></el-input>
        </el-form-item>
        <el-form-item label="Content">
          <div>
            <div id="editor" style="padding-left:0"></div>
          </div>

        </el-form-item>
      </el-form>
    </div>
    <div v-else>If you want to open a new topic, please <a href="../login" style="text-decoration: none">login</a>
      first.
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" v-if="$store.state.userInfo.role!='guest'" @click="addTopic">Submit</el-button>
      <el-button @click="dialogFormVisibleTopic = false">Cancel</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>

import Vditor from "vditor";

import "vditor/src/assets/scss/index.scss";
import {convert_time} from "@/utils/time";

let mkd = markdown => {
  Vditor.preview(document.getElementById('preview'),
      markdown, {
        speech: {
          enable: true,
        },
        anchor: 1,
        after() {
          if (window.innerWidth <= 768) {
            return
          }
        },
      })
}


export default {
  name: "viewModel",
  async created() {
    await this.getModel();
  },
  methods: {
    newTopic: function () {
      if (this.$store.state.userInfo.role != 'guest' && this.firstOpen) {
        this.firstOpen = false;
        this.markdownEditor = new Vditor('editor', {
          height: 360,
          toolbarConfig: {
            pin: true,
          },
          cache: {
            enable: false,
          },
          mode: 'sv',
          preview: {
            actions: [],
          },
          upload: {
            url: process.env.VUE_APP_BACKEND_URL + 'uploadFile',
            withCredentials: true, //不要忘了带cookie
            multiple: false,
            success: (editor, msg) => {
              let filename = JSON.parse(msg)["filename"];
              let filetype = JSON.parse(msg)["file_type"];
              if (filetype == 'image') {
                this.markdownEditor.insertValue(`![Title](${this.staticURL}/descFiles/${filename})`, false);
              } else {
                this.markdownEditor.insertValue(`[${filename}](${this.staticURL}/descFiles/${filename})`, false);
              }
            },
          },
        });
      }
    },
    getDiscussions: function (data) {
      this.searchData = data;
    },
    addTopic: async function () {
      let content = this.markdownEditor.getValue();
      let info = {
        modelID: this.$route.params.id,
        title: this.topic.title,
        content: content,
      }
      let msg = await this.$axios.post('addTopic', info);
      if (msg) {
        await this.$router.push('Discussion/' + msg["id"]);
      }
    },
    getModel: async function () {
      let modelInfo = await this.$axios.get("queryModel", {
        params: {
          "id": this.$route.params.id,
        }
      });
      this.modelInfo = modelInfo.data;
      convert_time(this.modelInfo);
      this.fileList = modelInfo.fileList;
      convert_time(this.fileList);
      this.maxFileName = this.fileList.reduce((p, v) => p.size < v.size ? v : p).name;
      this.picURL = this.staticURL + 'pics/' + modelInfo.data["structurePic"];
      this.tag = modelInfo.data['tags'].length > 0;
      mkd(modelInfo.data.howToRunAndDetails);
      //Show the purchase dialogue
      if (this.$route.query["buy"] == "true") {
        this.dialogFormVisible = true;
      }
    },
    renderSize: function (value) {
      if (null == value || value == '') {
        return "0 Bytes";
      }
      var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
      var index = 0;
      var srcsize = parseFloat(value);
      index = Math.floor(Math.log(srcsize) / Math.log(1024));
      var size = srcsize / Math.pow(1024, index);
      size = size.toFixed(2);//保留的小数位数
      return size + " " + unitArr[index];
    },
    getUserInfo: async function () {
      let userInfo = await this.$axios.get("getUserInfo");
      //注意这里，前端代码里不能有值读取不了的情况，否则整个系统都会崩掉！
      if (userInfo) {
        this.userInfo = userInfo.data;
      }
    },
    buyModel: async function () {
      this.$confirm('Do you really want to buy this model?', 'Model Purchase', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'success'
      }).then(async () => {
        const info = await this.$axios.get('buyModel', {
          params: {
            "id": this.$route.params.id,
          }
        });
        if (info) {
          await this.getModel();
          this.dialogFormVisible = false;
        }
      }).catch(() => {
      });
    }
  },
  data() {
    return {
      firstOpen: true,
      modelInfo: {},
      dialogFormVisible: false,
      dialogFormVisibleTopic: false,
      clickToSee: this.staticURL + 'pics/click.png',
      userInfo: {
        "deposit": 0,
      },
      topic: {
        modelID: this.$route.params.id,
        title: "",
      },
      picURL: "",
      tag: false,
      form: {
        id: 0,
        price: 0,
      },
      searchData: [],
      fileList: [],
      maxFileName: "",
      searchParams: {
        queryFields: [
          {
            label: 'Title',
            value: 'title',
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
            label: 'Update Time',
            value: 'update_time',
            type: 'datetime',
            comment: '(Must specify time, not only date)',
          }, {
            label: 'Create Time',
            value: 'create_time',
            type: 'datetime',
            comment: '(Must specify time, not only date)',
          },
        ],
        apiAddress: 'queryDiscussions',
        sortProp: "update_time",
        defaultSearchProp: "title",
        additionalConditions: {
          modelID: this.$route.params.id,
        },
      },
    };
  },
}
</script>

<style scoped>
.discussion_title{
  color:black!important;
  font-weight: 600;
  font-size:1.2em;
  text-align: left;
}
.discussion_title:hover{
  color:dodgerblue!important;

}
.content {
  min-width: 700px;
  margin: 0 auto 0 20px;
  /*max-width: 1400px;*/
  font-size: 18px;
}

tr td:first-child {
  text-align: right;
  font-weight: bold;
  vertical-align: text-top;
  width: 50%
}

td {
  padding-top: 10px;
  padding-left: 5px;
}

.title {
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: -10px;
}

p {
  line-height: 20px;
}

:deep(.el-tabs--left) {
  width: 100%
}
:deep(.el-tabs__item){
font-size:1em

}
.file_style {
  color: black !important;
}

.file_style:hover {
  color: dodgerblue !important;
}

:deep(.el-form-item) {
  text-align: left !important;
}

:deep(.el-form-item__label) {

  float: initial !important;
}
</style>
