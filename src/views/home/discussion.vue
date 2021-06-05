<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">Home Page</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/viewModel/'+modelID}">Model Information</el-breadcrumb-item>
    <el-breadcrumb-item>Discussion</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row>
      <h2 style="text-align: center;width: 100%">{{ title }}</h2>

      <el-card v-for="(item,index) in discussionInfo" :key="index"
               class="content">
        <div style="text-align: left">
          <p><span style="font-weight: bold">{{ item["nickname"] }}</span> said at
            {{ item["discussion_list"]["time"] }}:</p>
          <div :id="'preview'+index" style="padding-left:0"></div>
          <div style="margin-top: 10px" v-if="$store.state.userInfo.role=='manager'||item['discussion_list']['speaker'] == $store.state.userInfo.username">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </div>
        </div>
      </el-card>
      <div class="content" v-if="$store.state.userInfo.role!='guest'">
        <div style="text-align: left">
          <p><span style="font-weight: bold">Reply:</span></p>
          <div id="editor" style="padding-left:0"></div>
          <el-button type="primary" @click="reply" style="margin-top:20px;width:100px">Reply</el-button>
        </div>
      </div>
      <div class="content" v-else>If you want to comment, please <a href="../../login" style="text-decoration: none">login</a>
        first.
      </div>
    </el-row>
  </el-card>

</template>

<script>

import Vditor from "vditor";
import "vditor/src/assets/scss/index.scss";
import store from "@/store";
import router from "@/router";

export default {
  name: "discussion",
  async created() {
    await this.getDiscussions();
    if (this.$store.state.userInfo.role != 'guest') {
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
  methods: {
    reply: async function () {
      let content = this.markdownEditor.getValue();
      let info = {
        id: this.$route.params.id,
        content: content,
        title: this.title,
        modelID: this.modelID,
      }
      let msg = await this.$axios.post('addReply', info);
      if(msg){
        this.getDiscussions();
        this.markdownEditor.setValue("");
      }
    },
    getDiscussions: async function () {
      let discussionInfo = await this.$axios.get("queryDiscussion", {
        params: {
          "id": this.$route.params.id,
        }
      });
      this.discussionInfo = discussionInfo.data;
      this.modelID = this.discussionInfo[0]["modelID"];
      this.title = discussionInfo.data[0].title;
      console.log(this.discussionInfo);
      await this.$nextTick(() => {
        for (let i = 0; i < this.discussionInfo.length; i++) {
          let mkd = markdown => {
            Vditor.preview(document.getElementById('preview' + i),
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
                });
          }
          mkd(this.discussionInfo[i]["discussion_list"]["content"]);
        }
      });

      //Show the purchase dialogue
    }
    ,
  },
  data() {
    return {
      modelID: -1,
      discussionInfo: [],
      title: "",
    };
  },
}
</script>

<style scoped>
.content {
  width: 80%;
  margin: 0 auto 20px;
  min-width: 900px;
}

p {
  line-height: 20px;
}

:deep(.el-tabs--left) {
  width: 100%
}
</style>
