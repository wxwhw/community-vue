<template>
  <div class="main">
    <div class="article-list" style="background-color: #fff; border-radius: 5px;">
      <!-- item开始 -->
      <div class="article-item" v-for="article in articleList">
        <div class="article-item-header" style="display: flex; margin-bottom: 8px; align-items: center;">
          <div class="user-info" style="display: flex; align-items: center; margin: 0 8px 0 0;">
            <img :src="`http://localhost:9505/${article.user.avatar}`" alt=""
              style="width: 24px;height: 24px;border-radius: 50%; margin-right: 8px;">
            <a href="#">{{ article.user.nickname }}</a>
          </div>
          <div class="article-info">
            <p>{{ article.createAt }} · <a :href="`/community/${article.articleType.id}`">{{
              article.articleType.name }}</a></p>
          </div>
        </div>
        <div class="article-item-content">
          <a :href="`/article/${article.id}`">
            <div class="article-title">
              <el-tag v-if="article.top == 1" size="mini" type="success">顶</el-tag>
              <el-tag v-if="article.marrow == 1" size="mini" type="warning">精</el-tag>
              <el-tag v-if="article.official == 1" size="mini">官</el-tag>
              <el-tag v-if="article.auditState == 'PENDING'" size="mini" type="warning" effect="dark">审核中</el-tag>
              <el-tag v-if="article.auditState == 'REJECT'" size="mini" type="danger" effect="dark">已驳回</el-tag>
              <h2>{{ article.title }}</h2>
            </div>
            <!-- <div class="article-content" style="margin-bottom: 8px;">
              <p>{{ article.description }}</p>
            </div> -->

          </a>
          <div class="article-cover" v-if="article.coverUrl != null && article.coverUrl != ''">
            <el-image style="width: 160px; height: 90px;border-radius: 5px;"
              :src="`http://localhost:9505/${article.coverUrl}`">
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
            <span>{{ article.approvals }}</span>
          </div>
        </div>
      </div>
      <!-- item结束 -->
    </div>

    <!-- 分页 -->
    <div class="block" style="background-color: #fff;padding: 20px;">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
        layout="prev, pager, next" :total="total" background :hide-on-single-page="true">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    audit: {
      type: Boolean,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  created() {
    if (this.audit) {
      this.auditState = 'PASS'
    }
    this.loadArticleList()
  },
  data() {
    return {
      total: 0,
      pageNum: 1,
      pageSize: 5,
      articleList: [],
      auditState: ''
    }
  },
  methods: {
    loadArticleList() {
      this.request.get('http://localhost:9505/article/allArticles', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          auditState: this.auditState,
          authorId: this.userId
        }
      }).then(res => {
        if (res.code === 200) {
          this.articleList = res.result.articleList
          this.total = res.result.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.loadArticleList()
    },
  }
}
</script>

<style scoped>
.article-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.article-item-header {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  margin: 0 8px 0 0;
}

.user-info a {
  font-size: 12px;
  color: #666;
  text-decoration: none;

}

.article-info {
  margin-right: auto;
}

.user-info img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.article-info p {
  font-size: 12px;
  line-height: 12px;
  color: #ccc;
}

.article-item-content a {
  text-decoration: none;
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
