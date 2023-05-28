<template>
  <div class="main">
    <el-container>
      <el-header>
        <FrontHeader></FrontHeader>
      </el-header>

      <el-main>
        <div class="main-box">
          <div class="top-info">
            <h2 style="text-align: center; margin: 20px; ">{{community.name}}</h2>
            <p style="text-align: center;">{{ community.description }}</p>
          </div>
          <div class="result-box">
            <div class="article-list" style="background-color: #fff; border-radius: 5px;" v-if="articleList.length > 0">
              <!-- item开始 -->
              <div class="article-item" v-for="article in articleList">
                <div class="article-item-header" style="display: flex; margin-bottom: 8px; align-items: center;">
                  <div class="user-info" style="display: flex; align-items: center; margin: 0 8px 0 0;">
                    <img :src="`http://localhost:9505/${article.user.avatar}`" alt=""
                      style="width: 24px;height: 24px;border-radius: 50%; margin-right: 8px;">
                    <a href="#">{{ article.user.nickname }}</a>
                  </div>
                  <div class="article-info">
                    <p>{{ article.createAt }} · <a :href="`/articleType/${article.articleType.id}`">{{
                      article.articleType.name }}</a></p>
                  </div>

                </div>
                <div class="article-item-content">
                  <a :href="`/article/${article.id}`">
                    <div class="article-title">
                      <el-tag v-if="article.top == 1" size="mini" type="success">顶</el-tag>
                      <el-tag v-if="article.marrow == 1" size="mini" type="warning">精</el-tag>
                      <el-tag v-if="article.official == 1" size="mini">官</el-tag>
                      <h2>{{ article.title }}</h2>
                    </div>
                    <div class="article-content" style="margin-bottom: 8px;">
                      <p>{{ article.description }}</p>
                    </div>

                  </a>
                  <div class="article-cover" v-if="article.coverUrl != null && article.coverUrl != ''">
                    <el-image style="width: 160px; height: 90px;border-radius: 5px;"
                      :src="`http://localhost:9505/${article.coverUrl}`" :preview-src-list="urlToArray(article.coverUrl)">
                    </el-image>
                  </div>
                </div>

                <div class="article-item-footer" style="display: flex; align-items: center;">
                  <div class="tag-list" style="display: flex; margin-right: auto;">
                    <div class="tag-item" style="margin-right: 8px;" v-for="tag in article.tagList">
                      <a :href="`/tag/${tag.id}`">
                        <el-tag type="info">{{ tag.name }}</el-tag>
                      </a>
                    </div>

                  </div>

                  <div class="article-count" style="color: #bfbfbf; display: flex; align-items: center;">
                    <i class="el-icon-view"></i>
                    <span>{{ article.views }}</span>
                    <i class="el-icon-chat-dot-round"></i>
                    <span>{{ article.comments }}</span>
                    <i class="el-icon-star-off"></i>
                    <span>{{ article.collections }}</span>
                  </div>
                </div>
              </div>
              <!-- item结束 -->
            </div>
          </div>

          <!-- 分页 -->
          <div class="block" style="background-color: #fff;padding: 20px;">
            <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
              layout="prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>

        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import FrontHeader from '@/components/FrontHeader.vue';
export default {
  components: {
    FrontHeader
  },
  created() {
    this.communityId = this.$route.params.id
    this.loadArticleList()
    this.loadCommunity()
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      communityId: null,
      articleList: [],
      community: {}
    }
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.loadArticleList()
    },
    loadArticleList() {
      return this.request.get('http://localhost:9505/article/allArticles', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          auditState: 'PASS',
          title: '',
          typeId: this.communityId,
          official: '',
          top: '',
          marrow: '',
          authorId: ''
        }
      }).then(res => {
        if (res.code === 200) {
          this.articleList = res.result.articleList
          this.total = res.result.total
          for (const article of this.articleList) {
            article.description = this.transferHtmlToStr(article.htmlContent).substr(0, 200)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    urlToArray(url) {
      var urlList = []
      urlList.push('http://localhost:9505/' + url)
      return urlList
    },
    transferHtmlToStr(htmlStr) {
      let theConvertDiv = document.createElement("div")
      theConvertDiv.innerHTML = htmlStr
      return theConvertDiv.textContent || theConvertDiv.innerText || ""
    },
    loadCommunity(){
      this.request.get(`http://localhost:9505/postType/${this.communityId}`).then(res => {
        if(res.code === 200){
          this.community = res.result
        } else{
          this.$message.error('系统错误！')
        }
      })
    }
  }
}
</script>

<style scoped>
.main {
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-header {
  height: 64px !important;
}

.el-main {
  padding: 10px 0;
}

.main-box {
  width: 1000px;
  margin: 0 auto;
}

.top-info {
  padding: 20px;
}

.top-info p {
  font-size: 14px;
  color: #8c8c8c;
}

.result-box {
  background-color: #fff;
  border-radius: 5px;
  padding: 0 20px;
}

.article-item {
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.user-info a {
  font-size: 12px;
  color: #666;
  text-decoration: none;

}

.article-info {
  margin-right: auto;
}

.article-info p {
  font-size: 12px;
  line-height: 12px;
  color: #ccc;
}

.article-info a {
  font-size: 12px;
  line-height: 12px;
  color: #ccc;
  text-decoration: none;

}

.article-title {
  margin-bottom: 8px;
}

.article-title h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  display: inline;
}

.article-item-content a {
  text-decoration: none;
}

.article-content p {
  font-size: 14px;
  color: #999;
  line-height: 18px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-cover {
  margin-bottom: 8px;
}

.article-cover img {
  border-radius: 5px;
}

.article-count i {
  margin-right: 8px;
}

.article-count span {
  margin-right: 16px;
}
</style>
