<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">Home Page</el-breadcrumb-item>
    <el-breadcrumb-item>Model Details</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row>
      <el-col :span="1"></el-col>
      <el-col :span="22" style="text-align: left">
        <h2 style="text-align: center">Model Details</h2>
        <div class="content">
          <div>
            <p class="title">Model Name</p>
            <p>{{ modelInfo["modelName"] }}</p>
          </div>
          <div>
            <p class="title">Author</p>
            <p>{{ modelInfo["nickname"] }}</p>
          </div>
          <div>
            <p class="title">Original Framework</p>
            <p>{{ modelInfo["modelFramework"] }}</p>
          </div>
          <div>
            <p class="title">Description</p>
            <p>{{ modelInfo["modelDescription"] }}</p>
            <p v-if='modelInfo["modelDescription"]==""'>No description.</p>
          </div>
          <div>
            <p class="title">Tags</p>
            <div>
              <el-tag
                  v-for="(item, i) in modelInfo['tags']"
                  :key="i"
                  style="margin-top:20px"
              >{{ item }}</el-tag>
              <p v-if="!tag">No tags</p>
            </div>
          </div>
          <div>
            <p class="title">Model Price</p>
            <p style="color:blue;font-size:20px">SGD {{ modelInfo["price"] }}</p>
            <el-button type="warning" icon="el-icon-shopping-cart-2" size="medium" @click="dialogFormVisible = true">Buy
              Model
            </el-button>
          </div>
          <div>
            <div class="title">Model Structure (Click to Zoom)</div>
            <div style="margin-top:20px">
              <el-link type="primary" target="_blank" v-if="picURL && picURL.indexOf('undefined')<0 && picURL.indexOf('301')<0" :underline="false" :href="picURL">
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
            <p>{{ modelInfo["updated_time"] }}</p>
          </div>
          <div>
            <p class="title">Create Time</p>
            <p>{{ modelInfo["created_time"] }}</p>
          </div>
          <div>

            <p class="title" style="margin-bottom: 5px">Other Details</p>
            <p v-if='modelInfo["howToRunAndDetails"]==""||modelInfo["howToRunAndDetails"]=="\n"'>No other details</p>
          </div>
          <div>

          </div>
          <div id="preview" style="padding-left:0"></div>
<!--          <div id="outline"></div>-->
        </div>

        <div style="text-align: center;margin-top: 15px">

        </div>
      </el-col>
<!--      <el-col :span="6"></el-col>-->
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

</template>

<script>

import Vditor from "vditor";

import "vditor/src/assets/scss/index.scss";

const initOutline = () => {
  const headingElements = []
  Array.from(document.getElementById('preview').children).forEach((item) => {
    if (item.tagName.length === 2 && item.tagName !== 'HR' && item.tagName.indexOf('H') === 0) {
      headingElements.push(item)
    }
  })

  let toc = []
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY
    toc = []
    headingElements.forEach((item) => {
      toc.push({
        id: item.id,
        offsetTop: item.offsetTop,
      })
    })

    const currentElement = document.querySelector('.vditor-outline__item--current')
    for (let i = 0, iMax = toc.length; i < iMax; i++) {
      if (scrollTop < toc[i].offsetTop - 30) {
        if (currentElement) {
          currentElement.classList.remove('vditor-outline__item--current')
        }
        let index = i > 0 ? i - 1 : 0
        document.querySelector('span[data-target-id="' + toc[index].id + '"]').classList.add('vditor-outline__item--current')
        break
      }
    }
  })
}
let mkd = markdown => {
  Vditor.preview(document.getElementById('preview'),
      markdown, {
        speech: {
          enable: true,
        },
        anchor: 1,
        after () {
          if (window.innerWidth <= 768) {
            return
          }
          const outlineElement = document.getElementById('outline')
          Vditor.outlineRender(document.getElementById('preview'), outlineElement)
          if (outlineElement.innerText.trim() !== '') {
            outlineElement.style.display = 'block'
            initOutline()
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
    getModel: async function () {
      let modelInfo = await this.$axios.get("queryModel", {
        params: {
          "id": this.$route.params.id,
        }
      });
      this.modelInfo = modelInfo.data;
      this.picURL = this.staticURL + 'pics/' + modelInfo.data["structurePic"];
      this.tag = modelInfo.data['tags'].length > 0;
      console.log(this.modelInfo)
      mkd(modelInfo.data.howToRunAndDetails);
      //Show the purchase dialogue
      if (this.$route.query["buy"] == "true") {
        this.dialogFormVisible = true;
      }
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
      modelInfo: {},
      dialogFormVisible: false,
      clickToSee: this.staticURL + 'pics/click.png',
      userInfo: {
        "deposit": 0,
      },
      picURL:"",
      tag: false,
      form: {
        id: 0,
        price: 0,
      }
    };
  },
}
</script>

<style scoped>
.content{
  min-width: 900px;
  margin: 0 auto;
  max-width: 1400px;
  font-size: 18px;
}

tr td:first-child{
  text-align: right;
  font-weight: bold;
  vertical-align: text-top;
  width:50%
}

td {
  padding-top: 10px;
  padding-left: 5px;
}
.title{
  font-weight: bold;
  margin-top:20px;
  margin-bottom:-10px;
}
p{
  line-height: 20px;
}
</style>
