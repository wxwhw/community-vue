<template>
  <div class="main">
    <front-header></front-header>
    <div class="content-box">
      <el-row>
        <el-col :xs="24" :sm="{ span: 22, offset: 1 }" :md="{ span: 20, offset: 2 }" :lg="{ span: 16, offset: 4 }"
          :xl="{ span: 14, offset: 5 }">
          <!-- <el-alert title="上传图片的文件名请不要带空格，否则会解析错误！等待管理员修复" type="warning" center show-icon>
          </el-alert> -->
          <div class="head-box">
            <el-page-header @back="returnMain" content="" title="返回首页"></el-page-header>
            <!-- <el-button type="primary" icon="el-icon-back" @click="returnMain"></el-button> -->
            <input type="text" class="article-title" placeholder="总结一下这篇文章的重点吧~" v-model="article.title"
              :maxlength="limitTotal">
            <p style="line-height: 28px;">
              <span class="limit-word">{{ textLength }}</span>
              <span class="limit-total">/{{ limitTotal }}</span>
            </p>
          </div>
          <!-- 编辑器 -->
          <div class="editor-box">
            <mavon-editor ref=md @imgAdd="$imgAdd" @imgDel="$imgDel" v-model="article.markdownContent" :boxShadow=false
              fontSize="16px" placeholder="清晰有序的排版能带来更好的阅读体验..." @save="saveArticle"></mavon-editor>
          </div>
          <div class="form-box">
            <el-form ref="form" :model="article" label-width="80px">
              <el-form-item label="选择社区">
                <el-select v-model="article.typeId" size="medium" clearable>
                  <el-option v-for="item in allTypes" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="添加标签">
                <el-button size="medium" icon="el-icon-plus" @click="showTagSelectBox = true">标签</el-button><br>
                <el-tag v-for="tag in seletedTags" closable @close="handleCloseTag(tag)" size="medium" type="info"
                  style="margin-top:8px;margin-right: 8px;" :key="tag.id">{{ tag.name }}</el-tag>
              </el-form-item>
              <el-form-item label="文章封面">
                <el-upload class="avatar-uploader" action="http://localhost:9505/upload/uploadImg" :show-file-list="false"
                  :on-success="handleUploadSuccess" :before-upload="beforeUploadCover">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <p class="message">1.文件大小≤2MB，推荐上传16:9比例的封面图片</p>
                <p class="message">2.使用白底、白边图片作为封面可能无法通过审核</p>
                <p class="message">3.封面会用于各个展示位，请选择准确、清晰、美观的图片作为封面，将极大增加被推荐的概率</p>
                <!-- 图片裁剪框 -->
                <!-- <el-dialog title="编辑封面" :visible.sync="showCropper" width="600px" :close-on-click-modal="false">
                  <div class="cropper-box" style="width: 420px; height: 420px; margin: 0 auto;">
                    <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" fixed
                      :fixedNumber="option.fixedNumber" :outputType="option.outputType" mode="contain" :centerBox="true"
                      :autoCrop="true">
                    </vueCropper>
                  </div>
                  <span>使用白底、白边图片作为封面可能无法通过审核</span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="showCropper = false" size="medium">取 消</el-button>
                    <el-button type="primary" @click="showCropper = false" size="medium">确 定</el-button>
                  </span>
                </el-dialog> -->
              </el-form-item>
              <el-form-item label="申请精华">
                <el-switch v-model="marrow"></el-switch>
              </el-form-item>
              <el-form-item>
                <el-button size="medium" type="primary" @click="postArticle">发布</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 选择标签模态框 -->
          <el-dialog :visible.sync="showTagSelectBox" width="600px" title="选择标签">
            <div v-for="tagGroup in allTags">
              <h1 style="font-size: 18px; font-weight: 600;">{{ tagGroup.groupName }}</h1>
              <el-checkbox-group v-model="seletedTags" @change="handleSelectedTags" :min="1" :max="3">
                <el-checkbox border v-for="tag in tagGroup.tagGroup" :label="tag" :key="tag.id">{{ tag.name
                }}</el-checkbox>
              </el-checkbox-group>
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="showTagSelectBox = false">取 消</el-button>
              <el-button type="primary" @click="showTagSelectBox = false">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import FrontHeader from '@/components/FrontHeader.vue';
import jsCookie from 'js-cookie';
export default {
  name: 'editor',
  components: {
    FrontHeader
  },
  created() {
    this.loadData()
    var id = jsCookie.get('user_id')
    if (!id) {
      var token = jsCookie.get('token')
      if (!token) {
        this.$route.replace('/index')
      }
    } else {
      this.article.userId = id
    }
    this.checkDraft()
  },
  computed: {
    textLength() {
      if (this.article.title) {
        return this.article.title.length
      } else {
        return 0
      }
    }
  },
  data() {
    return {
      showTagSelectBox: false,
      baseUrl: 'http://localhost:9505/',
      showCropper: false,
      option: {
        img: '',
        size: 1,
        fixedNumber: [16, 9]
      },
      innerText: '',
      seletedTags: [],
      allTags: [],
      allTypes: {},
      marrow: false,
      article: {
        title: '',
        tagIds: []
      },
      props: {
        multiple: true
      },
      imageUrl: '',
      limitWord: 0,
      limitTotal: 60,
    }
  },
  methods: {
    beforeUploadCover(file) {
      const isFile = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isFile) {
        this.$message.error('上传图片格式不正确!');
      }
      console.log(file.type);
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return  isFile && isLt2M
    },
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.imageUrl = URL.createObjectURL(file.raw);
        this.article.coverUrl = res.result.url
      } else{
        this.$message.error(res.msg)
      }
    },
    handleOnChange(file) {
      this.article.coverUrl = URL.createObjectURL(file.raw)
    },
    countWord() {
      this.limitWord = this.article.title.length
    },
    returnMain() {
      window.location.href = 'http://localhost:8080'
    },
    loadData() {
      this.request.get("/postType/allTypes").then(res => {
        this.allTypes = res.result
      })
      this.request.get("/tag/allTags").then(res => {
        this.allTags = res.result
      })
    },
    handleSelectedTags() {
      var tagIds = []
      this.seletedTags.forEach(tag => {
        tagIds.push(tag.id)
      });
      this.article.tagIds = tagIds

    },
    handleCloseTag(tag) {
      this.seletedTags.splice(this.seletedTags.indexOf(tag), 1);
      this.article.tagIds.splice(this.article.tagIds.indexOf(tag.id), 1)
    },
    saveArticle(value, render) {
      this.article.markdownContent = value
      this.article.htmlContent = render
      if (this.preCheck()) {
        this.$confirm('确认保存为草稿吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          localStorage.setItem('draft', JSON.stringify(this.article))
          this.$message.success('保存成功啦~')
          this.$router.replace('/index')
        })
      }
    },
    postArticle() {
      this.article.htmlContent = this.$refs.md.d_render
      if (this.preCheck()) {
        this.request.post('http://localhost:9505/article/publish', this.article).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.$router.push('/index')
            localStorage.removeItem('draft')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    preCheck() {
      if (!this.article.title) {
        this.$message.error('请填写标题~')
        return false
      } else if (!this.article.markdownContent) {
        this.$message.error('请填写文章内容~')
        return false
      } else if (!this.article.htmlContent) {
        this.$message.error('编辑器错误，请联系管理员~')
        return false
      } else if (!this.article.userId) {
        this.$router.replace('/index')
        return false
      } else if (!this.article.typeId) {
        this.$message.error('请选择社区~')
        return false
      } 
      return true
    },
    $imgAdd(pos, $file) {//图片文件添加回调事件(pos: 图片在列表中的位置, File: File对象)

      if ($file.size >= 1024 * 1024 * 2) {
        this.$message.warning('图片大小不超过2M哦~')
        this.$refs.md.$imgDel([pos, $file])
      } else {
        var formdata = new FormData();
        formdata.append('file', $file);
        this.request.post("http://localhost:9505/upload/uploadImg", formdata).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            var url = 'http://localhost:9505/' + res.result.url
            this.$refs.md.$img2Url(pos, url)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }

    },
    $imgDel(array) {//图片文件删除回调事件(Array(2): 两个元素的数组，第一位是图片在列表中的位置，第二位是File对象)

    },
    checkDraft(){
      let draft = JSON.parse(localStorage.getItem('draft'))
      if(draft){
        this.$confirm('继续编辑上次内容吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.article = draft
          this.article.tagIds = []
          this.imageUrl = 'http://localhost:9505/' + this.article.coverUrl
        }).catch(() => {
          this.article = {}       
        });
      }
    },
  }
}
</script>

<style scoped>
.main {
  background-color: #f4f7f8;
  width: 100%;
  height: 100%;

}

.content-box {
  margin-top: 20px;
}

.head-box /deep/ .el-page-header__left {
  align-items: center !important;
}

.el-col {
  background: #fff;
}

.head-box {
  padding: 20px;
  background-color: #fff;
  display: flex;
}

.article-title {
  margin-left: 16px;
  line-height: 28px;
  border: none;
  font-size: 20px;
  font-weight: 600;
  color: #14191e;
  outline: none;
  flex: 1;
}

.article-title::placeholder {
  color: #c8cdd2;
}

.form-box {
  padding: 20px;
}


.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader /deep/ .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 215px;
  height: 121px;
  line-height: 121px;
  text-align: center;
}

.avatar {
  width: 215px;
  height: 121px;
  display: block;
  object-fit: cover;
}

.limit-word {
  color: #14191e;
  font-weight: 600;
  font-size: 20px;
}

.limit-total {
  color: #c8cdd2;
  font-size: 20px;
  font-weight: 600;
}

.message {
  color: #c8cdd2;
  font-size: 12px;
  height: 17px;
  line-height: 17px;
  margin-top: 8px;
}

.el-checkbox {
  margin-left: 0 !important;
  margin-bottom: 8px;
  margin-right: 8px;
}
</style>