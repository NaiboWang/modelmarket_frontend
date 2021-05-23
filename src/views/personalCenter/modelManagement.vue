<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/personalHome' }">
      {{ $store.state.userRole == 'user' ? 'Personal Center' : 'Management Center' }}
    </el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/personalModelList'}">Model Management</el-breadcrumb-item>
    <el-breadcrumb-item>{{ $route.params.id == -1 ? "New Model" : "View/Edit Model" }}</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-alert v-if="$store.state.userRole=='user'" title="Please edit model info" type="info" center show-icon
              :closable="false"></el-alert>
    <el-alert v-else title="You can only view the model info" type="info" center show-icon :closable="false"></el-alert>
    <!-- 步骤条 -->
    <el-form
        class="form_center_layout"
        ref="modelInfoFormRef"
        :model="modelInfoForm"
        :rules="modelInfoFormRules"
        label-width="250px"
        :disabled="$store.state.userRole=='manager'"
    >
      <el-form-item label="Model Name" prop="modelName">
        <el-input v-model="modelInfoForm.modelName"></el-input>
      </el-form-item>
      <el-form-item label="Model Description" prop="modelDescription">
        <el-input type="textarea" v-model="modelInfoForm.modelDescription"></el-input>
      </el-form-item>
      <el-form-item label="How to Run Model/Other Information" prop="modelDescription">
        <div id="vditor" style="text-align: left"></div>
      </el-form-item>
      <el-form-item style="text-align: left" label="Original Framework" prop="modelFramework">
        <el-select v-model="modelInfoForm.modelFramework" placeholder="Please select">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Price" prop="price">
        <el-input v-model.number="modelInfoForm.price"></el-input>
      </el-form-item>
      <el-form-item style="text-align: left" label="Tags" prop="tags">
        <el-tag
            v-for="(item, i) in modelInfoForm.tags"
            :key="i"
            closable
            @close="handleClose(i)"
        >{{ item }}
        </el-tag>
        <!-- 输入Tag文本框 -->
        <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            placeholder="Press enter to add new tag"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
        ></el-input>
        <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="inputVisible=true"
        >+ New Tag
        </el-button>

      </el-form-item>
      <el-form-item style="text-align: left" label="Model File">
        <el-upload
            class="upload-demo"
            :action="$axios.defaults.baseURL+'uploadModel'"
            :on-success="handleSuccess"
            :limit="1"
            :data="mId"
            with-credentials
            :on-remove="handleRemove"
        >
          <el-button size="small" type="primary">Upload</el-button>
        </el-upload>
      </el-form-item>
      <!--      控制form规则的是item不是里面的内容-->
      <el-form-item style="text-align: left" :label="''" prop="filename">
        <template v-slot:label>File Name at Server</template>
        <el-link type="primary" target="_blank" v-if="$route.params.id!=-1&&modelInfoForm.filename!=''"
                 :underline="false" :href="$axios.defaults.baseURL+'downloadModel?type=1&id='+$route.params.id">
          {{ modelFilename }}
        </el-link>
        <span v-else>{{ modelFilename }}</span>
      </el-form-item>
      <el-form-item style="text-align: left" label="">
        <template v-slot:label><p style="line-height: 130%">Model Structure <br> (Click to Zoom)</p></template>
        <div v-if="picURL.indexOf('301')>=0">
          Sorry, we cannot get the structure picture of the uploaded model!
        </div>
        <el-link type="primary" target="_blank" v-else-if="picURL&&picURL.indexOf('undefined')<0" :underline="false"
                 :href="picURL">
          <el-image
              :src="picURL"
              style="max-height:250px;overflow: auto"
              fit="scale-down">
            <!--              <template #error>-->
            <!--                <div class="image-slot">-->
            <!--                  -->
            <!--                </div>-->
            <!--              </template>-->
          </el-image>
        </el-link>

        <div v-else>
          Wait for uploading...
        </div>

      </el-form-item>
      <el-form-item style="text-align: left" label="Status" prop="status">
        <el-switch v-model="modelInfoForm.status">
        </el-switch>
      </el-form-item>
      <el-form-item v-if="$route.params.id!=-1" label="Created Time" prop="created_time">
        <el-input v-model="modelInfoForm.created_time" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="$route.params.id!=-1" label="Updated Time" prop="updated_time">
        <el-input v-model="modelInfoForm.updated_time" disabled></el-input>
      </el-form-item>

    </el-form>
    <div v-if="$store.state.userRole=='user'">
      <el-button type="primary"  size="medium" @click="uploadModel">
        {{ $route.params.id == -1 ? "Add New Model" : "Update Model" }}
      </el-button>
      <el-button type="success" v-if="$route.params.id != -1" size="medium" @click="uploadModel(true)">
        Save as New Model
      </el-button>
    </div>

  </el-card>
</template>

<script>
import Vditor from "vditor";
// import "~vditor/src/assets/scss/index";
import "vditor/src/assets/scss/index.scss";

export default {
  name: "modelManagement",
  created() {
    this.$store.commit("setActivePath", "/personalModelList")
  },
  async mounted() {
    this.markdownEditor = new Vditor('vditor', {
      height: 360,
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      mode: 'sv',
      preview:{
        actions:[],
      },
      upload: {
        url: process.env.VUE_APP_BACKEND_URL + 'uploadFile',
        withCredentials: true, //不要忘了带cookie
        multiple: false,
        success: (editor, msg) => {
          let filename = JSON.parse(msg)["filename"];
          let filetype = JSON.parse(msg)["file_type"];
          if (filetype == 'image') {
            this.markdownEditor.insertValue( `![Title](${this.staticURL}/descFiles/${filename})`, false);
          } else{
            this.markdownEditor.insertValue(`[${filename}](${this.staticURL}/descFiles/${filename})`, false);
          }
        },
      },
      after: async () => {
        await this.getModel();
        this.markdownEditor.setValue(this.modelInfoForm.howToRunAndDetails, false);
      },
    });
  },
  methods: {
    // 文本框失去焦点,或者按下Enter触发
    handleInputConfirm() {
      // 输入的内容为空时，清空
      if (this.inputValue.trim().length === 0) {
        this.inputValue = ''
        this.inputVisible = false
        return;
      } else if (this.modelInfoForm.tags.includes(this.inputValue.trim())) {
        this.inputValue = ''
        this.inputVisible = false
        return;
      }
      this.modelInfoForm.tags.push(this.inputValue.trim())
      this.inputValue = ''
      this.inputVisible = false
    },
    getModel: async function (id = false) {
      if (this.$route.params.id != -1 || id) {
        let modelInfo = await this.$axios.get("queryModel", {
          params: {
            "id": id ? id : this.$route.params.id,
          }
        });
        this.modelInfoForm = modelInfo.data;
        this.picURL = this.staticURL + 'pics/' + modelInfo.data["structurePic"];
      }
    },
    handleSuccess(response, file, fileList) {
      if (response) {
        this.$message.success("Upload Success!");
        this.modelInfoForm.filename = response["filename"];
        setTimeout(() => {
          this.picURL = this.staticURL + 'pics/' + response["structurePic"];
          this.modelInfoForm.structurePic = response["structurePic"];
        }, 1000);
      }
    },
    handleRemove(file, fileList) {
      this.modelInfoForm.filename = "";
      this.picURL = "";
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      this.modelInfoForm.tags.splice(i, 1)
    },
    uploadModel: async function (newModel = false) {
      this.$refs.modelInfoFormRef.validate(async valid => {
        if (!valid) {
          return false;
        }
        if(this.$route.params.id == -1 || newModel == true){
          this.newModel = true;
        }
        this.$confirm(!this.newModel ? 'Do you really want to update model info?' : 'Do you really want to add new model?', 'Confirm', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'success'
        }).then(async () => {
          this.modelInfoForm.howToRunAndDetails = this.markdownEditor.getValue();
          let modelInfo = this.$lodash.clone(this.modelInfoForm);
          if(this.newModel)
          {
            modelInfo.id = -1;
          }
          const info = await this.$axios.post('manageModel', {"params": JSON.stringify(modelInfo)});
          if (info) {
            if (this.newModel) {
              this.$message.success('New model has been successfully added!');
              //这里得出个结论，如果push之后id会变但是不会重新执行getModel函数因为组件没有重新加载，而且就算push之后下面的函数还是在原来id为-1的时候执行的，所以函数返回$route.params.id还是-1！
              this.$router.push("/manageModel/" + info["id"]);
              await this.getModel(info["id"]);
            } else {
              this.$message.success('Model Update Success!');
              await this.getModel();
            }
          }
        }).catch(() => {
        });
      })
    },
  },
  data() {
    const checkPrice = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('Please input Integer'));
      } else {
        if (value < 0) {
          callback(new Error('The price must be at least 0'));
        } else {
          callback();
        }
      }
    };
    return {
      inputVisible: false,
      inputValue: "",
      markdownEditor: "",
      picURL: '',
      newModel: false,
      options: [
        {
          value: "sklearn",
          label: "Scikit-learn",
        },
        {
          value: "pytorch",
          label: "PyTorch",
        }
      ],
      modelInfoForm: {
        id: this.$route.params.id,
        modelName: "",
        modelDescription: "",
        howToRunAndDetails: "",
        modelFramework: "sklearn",
        tags: [],
        filename: "",
        price: 0,
        structurePic: "",
        status: true,
        created_time: "",
        updated_time: "",
      },
      fileLists: [],
      // 表单验证
      modelInfoFormRules: {
        modelName: [
          {required: true, message: 'Please enter model name', trigger: 'blur'},
          {min: 2, message: 'The length of model should at least 2 characters', trigger: 'blur'}
        ], price: [
          {validator: checkPrice, required: true, trigger: 'blur'}
        ], modelFramework: [
          {required: true}
        ], filename: [
          {required: true, min: 1, message: 'Please upload model file!', trigger: 'blur'}
        ]
      },
      mId: {"mId": this.$route.params.id},
    };
  },
  computed: {
    modelFilename() {
      if (this.modelInfoForm.filename == "") {
        return "Wait for uploading..."
      } else {
        return this.modelInfoForm.filename;
      }
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin-right: 8px;
}

.input-new-tag {
  width: 200px;
}

.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.form_center_layout {
  min-width: 500px;
  max-width: 1500px;
  margin: 20px auto 0;
}
</style>
