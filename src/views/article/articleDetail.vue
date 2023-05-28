<template>
  <div class="main">
    <el-container>
      <el-header>
        <FrontHeader></FrontHeader>
      </el-header>
      <el-main>
        <el-row :gutter="20">

          <el-col :span="10" :offset="5">
            <div class="article-box br5">
              <div class="article-title">
                <h1>{{ article.title }}</h1>
              </div>

              <div class="article-user-info">
                <img :src="serverUrl + article.user.avatar" alt="User Avatar" v-if="article.user.avatar != ''">
                <div class="user-info">
                  <div class="user-name"><a :href="`/user/${article.user.id}`">{{ article.user.nickname }}</a></div>
                  <div class="post-info"><i class="el-icon-time" style="margin-right: 5px;"></i>
                    <span>{{ article.createAt }}</span>
                    <i class="el-icon-view" style="margin-right: 5px;"></i>
                    <span>{{ article.views }}</span>
                    <i class="el-icon-chat-square" style="margin-right: 5px;"></i>
                    <span>{{ article.comments }}</span>
                  </div>
                </div>
                <div v-if="article.user.id == loginUserId">
                  <!-- <el-button type="text" icon="el-icon-edit">编辑</el-button> -->

                  <el-button type="text" icon="el-icon-delete" @click="deleteArticle">删除</el-button>


                </div>

              </div>

              <div class="taglist-box">
                <a :href="`/community/${article.articleType.id}`" target="_blank"><el-tag type="info">{{
                  article.articleType.name }}</el-tag></a>
                <a :href="`/tag/${tag.id}`" target="_blank" v-for="tag in article.tagList"><el-tag type="info">{{ tag.name
                }}</el-tag></a>

              </div>

              <div class="article-content">
                <!-- html内容开始 -->
                <div class="markdown-body" v-html="article.htmlContent">
                </div>
                <!-- html内容结束 -->
              </div>

              <div class="article-footer">
                <span style="font-size: 14px; color: #8c8c8c; margin-right: auto;">最后一次编辑于 {{ article.updateAt }}</span>
                <div style="display: flex;">

                  <!-- 收藏 -->
                  <div class="like" style="display: flex; align-items: center; cursor: pointer;" v-if="!this.collected">
                    <img :src="require(`@/assets/collect.svg`)" alt="" width="30" height="30" style="margin-right: 8px;"
                      @click="addCollections">
                    <span>{{ article.collections }}</span>
                  </div>

                  <!-- 取消收藏 -->
                  <div class="like" style="display: flex; align-items: center; cursor: pointer;" v-else>
                    <img :src="require(`@/assets/collect-solid.svg`)" alt="" width="30" height="30"
                      style="margin-right: 8px;" @click="cancelCollected">
                    <span>{{ article.collections }}</span>
                  </div>

                  <!-- 点赞 -->
                  <div class="like" style="display: flex; align-items: center; cursor: pointer;" v-if="!this.liked">
                    <img :src="require(`@/assets/like.svg`)" alt="" width="30" height="30" style="margin-right: 8px;"
                      @click="addApprovals">
                    <span>{{ article.approvals }}</span>
                  </div>

                  <!-- 取消点赞 -->
                  <div class="like" style="display: flex; align-items: center; cursor: pointer;" v-else>
                    <img :src="require(`@/assets/like-solid.svg`)" alt="" width="30" height="30"
                      style="margin-right: 8px;" @click="cancelLike">
                    <span>{{ article.approvals }}</span>
                  </div>

                </div>
              </div>


            </div>

            <div class="edit-comment br5" style="margin-top: 20px; padding:20px; background-color: #fff; display: flex;">
              <div style="margin-right: 16px;">
                <img :src="serverUrl + loginUserInfo.avatar" alt="" style="border-radius: 50%;" width="36" height="36"
                  v-if="loginUserInfo.avatar != ''">
              </div>
              <div style="width: 100%;">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 6 }" placeholder="写评论"
                  v-model="mycomment"></el-input>
                <el-button type="primary" style="margin-top: 20px; float: right;" @click="sendComment">发送</el-button>
              </div>
            </div>

            <div class="comment-list br5" style="padding: 10px 20px 20px; margin-top: 20px; background-color: #fff;">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="`评论 ${this.totalComment}`" name="allComments">

                  <div class="comment-item" v-for="(rootCommentItem, index) in commentList" :key="rootCommentItem.id">
                    <!-- 根评论 -->
                    <div class="root-comment-container">
                      <div class="root-user-avatar mr16">
                        <img class="br50" :src="`${serverUrl}${rootCommentItem.user.avatar}`" alt=""
                          v-if="rootCommentItem.user.avatar != ''">
                      </div>
                      <div class="root-comment-right">
                        <div class="root-user-info"><a :href="`/user/${rootCommentItem.user.id}`">{{
                          rootCommentItem.user.nickname }}</a></div>
                        <div class="comment-content">
                          <p>{{ rootCommentItem.content }}</p>
                        </div>
                        <div class="comment-info">
                          <span class="comment-time">{{ rootCommentItem.createAt }}</span>
                          <el-button type="text" @click="rootReply(rootCommentItem.id, index)">回复</el-button>
                          <el-popconfirm title="确定删除该评论吗？" @confirm="deleteComment(rootCommentItem.id, 'Root')"
                            v-if="rootCommentItem.user.id == loginUserId">
                            <el-button type="text" style="color: #F56C6C;" slot="reference">删除</el-button>
                          </el-popconfirm>
                        </div>

                        <!-- 二级评论 -->
                        <div class="sub-comment-container"
                          v-if="rootCommentItem.subComList != null && rootCommentItem.subComList.length > 0">
                          <div class="sub-comment-list" v-for="subCommentItem in rootCommentItem.subComList">
                            <div class="sub-comment-item">
                              <div class="sub-user-avatar mr8">
                                <img class="br50" :src="`${serverUrl}${subCommentItem.user.avatar}`" alt=""
                                  v-if="subCommentItem.user.avatar != ''">
                              </div>
                              <div class="sub-comment-right">
                                <div class="sub-user-info"><a :href="`/user/${subCommentItem.user.id}`">{{
                                  subCommentItem.user.nickname }}</a></div>
                                <span class="sub-toUser-info" v-if="subCommentItem.toUser != null">回复 <a
                                    :href="`/user/${subCommentItem.toUser.id}`" class="user-jump-link">@{{
                                      subCommentItem.toUser.nickname
                                    }}</a>:</span>
                                <div class="comment-content">
                                  <p>{{ subCommentItem.content }}</p>
                                </div>
                                <div class="comment-info">
                                  <span class="comment-time">{{ subCommentItem.createAt }}</span>
                                  <el-button type="text"
                                    @click="replyUser(rootCommentItem.id, subCommentItem.user.id, subCommentItem.user.nickname, index)">回复</el-button>
                                  <el-popconfirm title="确定删除该评论吗？" @confirm="deleteComment(subCommentItem.id, 'Sub')"
                                    v-if="subCommentItem.user.id == loginUserId">
                                    <el-button style="color: #F56C6C;" type="text" icon="el-icon-delete"
                                      slot="reference">删除</el-button>
                                  </el-popconfirm>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="sub-edit-comment" v-if="showInput == index">
                          <el-input class="mr8" type="textarea" :rows="1" :placeholder="placeholderText"
                            v-model="subComment"></el-input>
                          <el-button type="primary" @click="sendCommentRequest">发送</el-button>
                        </div>
                      </div>
                    </div>
                  </div>

                </el-tab-pane>
                <!-- <el-tab-pane label="只看楼主" name="authorComment">

                </el-tab-pane>
                <el-tab-pane label="最新" name="newComment">

                </el-tab-pane> -->
              </el-tabs>
            </div>
          </el-col>
          <el-col :span="4">
            <!-- 作者信息 -->
            <el-card class="box-card" shadow="never">
              <a :href="`/user/${article.user.id}`" target="_blank" rel="noopener noreferrer"
                style="text-decoration: none;">
                <div class="avatar" style="display: flex;justify-content: center;align-items: center;">
                  <img style="margin:0 auto;width:84px;height:84px;border-radius: 50%;"
                    :src="serverUrl + article.user.avatar" alt="User Avatar" v-if="article.user.avatar != ''">
                </div>
                <span style="margin-top:16px; display: block; text-align: center; color: #313334">{{ article.user.nickname
                }}</span>


                <!-- <a style="display:block;text-align: center; text-decoration: none; color: #313335;" href="#"
                target="_blank">{{ this.username }}</a> -->
              </a>

              <div style="display: flex; justify-content: center; margin-top: 16px;">
                <el-popconfirm title="确认取消关注吗?😔" @confirm="cancelFollow" v-if="this.userIsFollow">
                  <el-button icon="el-icon-check" slot="reference" v-if="this.userIsFollow">已关注</el-button>
                </el-popconfirm>
                <el-button icon="el-icon-plus" type="primary" @click="followUser" v-if="!this.userIsFollow">关注</el-button>
              </div>

              <div class="user-count">
                <div class="user-count-item">
                  <h3>20</h3>
                  <p>文章</p>
                </div>
                <div class="user-count-item">
                  <h3>33</h3>
                  <p>关注</p>
                </div>
                <div class="user-count-item">
                  <h3>99</h3>
                  <p>粉丝</p>
                </div>

              </div>

            </el-card>

            <el-card class="box-card" shadow="never">
              <div slot="header">
                <span class="card-title">热门标签</span>
              </div>
              <div v-for="tag in hottagList" :key="tag.id" class="article-type-item"
                style="display: inline-block; margin-bottom: 8px;">
                <a :href="`/tag/${tag.id}`" target="_blank" rel="noopener noreferrer">
                  <el-tag size="mini" :type="randomType()" effect="plain">{{ tag.name }}</el-tag>
                </a>
              </div>
            </el-card>

            <el-card class="box-card" shadow="never">
              <div slot="header">
                <span class="card-title">相关文章</span>
              </div>
              <div class="related-card" v-for="item in relatedArticleList" :key="item.id">
                <a :href="`/article/${item.id}`" target="_blank">
                  <div class="relatedArticle-box">
                    <img :src="`http://localhost:9505/${item.coverUrl}`" alt="" v-if="item.coverUrl != ''">
                    <p>{{ item.title }}</p>
                  </div>
                </a>
              </div>
            </el-card>

          </el-col>
        </el-row>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';
import { bus } from '@/utils/event-bus';
import FrontHeader from '@/components/FrontHeader.vue';
import Cookies from 'js-cookie'
export default {
  name: 'articleDetail',
  components: {
    FrontHeader,
  },
  created() {
    const articleId = this.$route.params.id
    this.loadArticle(articleId)
    this.loadRelatedArticle(articleId)
    this.getHotTags()
    this.loadComments(articleId)
    this.$watch('loginUserInfo', (newVal, oldVal) => {
      this.loginUser = newVal
      this.loginUserId = this.loginUser.id
      this.likeForm.articleId = articleId
      this.likeForm.userId = this.loginUser.id
      this.collectForm.followed = articleId
      this.collectForm.userId = this.loginUser.id
      this.checkIfCollect(articleId, this.loginUser.id)
      this.checkIfLike(articleId, this.loginUser.id)

    })

    this.$watch('article', (newVal, oldVal) => {
      let authorId = newVal.user.id
      let userId = Cookies.get('user_id')
      this.checkUserIsFollow(authorId, userId)
    })
  },
  computed: {
    ...mapState(['loginUserInfo']),
    ...mapGetters(['isLogin'])
  },
  data() {
    return {
      serverUrl: 'http://localhost:9505/',
      username: '房東的猫-',
      likeSvg: 'like-solid',
      collectSvg: 'collect',
      activeName: 'allComments',
      mycomment: '',
      subComment: '',
      totalComment: 0,
      relatedArticleList: [],
      article: {
        user: {
          avatar: ''
        }
      },
      placeholderText: '评论',
      loginUserId: null,
      hottagList: {},
      commentList: [],
      loginUser: {},
      commentForm: {},
      showInput: -1,
      likeForm: {},
      collectForm: {},
      liked: false,
      collected: false,
      userIsFollow: false,
      followUserForm: {}
    }
  },
  methods: {
    checkIfLike(articleId, userId) {
      if (this.isLogin) {
        this.request.get(`http://localhost:9505/article/getIfLiked?articleId=${articleId}&userId=${userId}`).then(res => {
          if (res.code === 200) {
            if (res.result) {
              this.liked = true
            } else {
              this.liked = false
            }
          }
        })
      }
    },
    checkIfCollect(articleId, userId){
      if (this.isLogin) {
        this.request.get(`http://localhost:9505/article/getIfCollected?followed=${articleId}&userId=${userId}`).then(res => {
          if (res.code === 200) {
            if (res.result) {
              this.collected = true
            } else {
              this.collected = false
            }
          }
        })
      }
    },
    // 点赞
    addApprovals() {
      if (this.isLogin) {
        this.request.post('http://localhost:9505/article/like', this.likeForm).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.article.approvals++
            this.liked = res.result.liked
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        bus.$emit('showLoginBox', '打开登录框')
      }

    },
    cancelLike() {
      this.request.post('http://localhost:9505/article/cancelLike', this.likeForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.article.approvals--
          this.liked = res.result.liked
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    addCollections() {
      if (this.isLogin) {
        this.request.post('http://localhost:9505/article/collect', this.collectForm).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.article.collections++
            this.collected = res.result.collected
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        bus.$emit('showLoginBox', '打开登录框')
      }
    },
    cancelCollected() {
      this.request.post('http://localhost:9505/article/cancelCollect', this.collectForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.article.collections--
          this.collected = res.result.collected
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleClick() {

    },
    sendComment() {
      if (this.isLogin) {
        const articleId = this.$route.params.id
        this.commentForm = {}
        this.commentForm.userId = this.loginUserInfo.id
        this.commentForm.postId = this.$route.params.id
        this.commentForm.content = this.mycomment
        this.request.post("http://localhost:9505/comments/sendComment", this.commentForm).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.loadComments(articleId)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        bus.$emit('showLoginBox', '打开登录框')
      }

    },
    randomType() {
      var types = ['', 'success', 'info', 'danger', 'warning']
      var index = Math.floor(Math.random() * types.length)
      return types[index]
    },
    loadArticle(articleId) {
      this.request.get(`http://localhost:9505/article/${articleId}`).then(res => {
        if (res.code === 200) {
          this.article = res.result.articleDetail
        } else if (res.code === 404) {
          this.$message.error(res.msg)
          this.$router.push('/404')
        } else {
          this.$message.error('加载文章详情失败~')
          this.$router.push('/404')
        }
      })
    },
    loadRelatedArticle(articleId) {
      this.request.get(`http://localhost:9505/article/relatedArticleList?articleId=${articleId}`).then(res => {
        if (res.code === 200) {
          this.relatedArticleList = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // getLoginUserId() {
    //   var id = Cookies.get('user_id')
    //   var isLogin = Cookies.get('isLogin')
    //   if (isLogin) {
    //     this.loginUserId = id
    //     console.log(this.loginUserId);
    //   } else{
    //     console.log("error");
    //   }
    // },
    getHotTags() {
      this.request.get('http://localhost:9505/tag/hottag').then(res => {
        if (res.code === 200) {
          this.hottagList = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    loadComments(articleId) {
      this.request.get(`http://localhost:9505/comments/getRootComment?articleId=${articleId}`).then(res => {
        if (res.code === 200) {
          this.commentList = res.result.commentList
          this.totalComment = res.result.total
          // console.log(res.result);
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    rootReply(rootId, index) {
      if (this.isLogin) {
        this.showInput = index
        this.subComment = ''
        this.placeholderText = `评论`
        var userId = this.loginUserInfo.id
        var articleId = this.$route.params.id
        this.commentForm = {}
        this.commentForm.rootId = rootId
        this.commentForm.userId = userId
        this.commentForm.postId = articleId
      } else {
        bus.$emit('showLoginBox', '打开登录框')
      }
    },
    replyUser(rootId, toUserId, toUserName, index) {
      if (this.isLogin) {
        this.showInput = index
        this.subComment = ''
        const articleId = this.$route.params.id
        this.commentForm = {}
        this.commentForm.userId = this.loginUserInfo.id
        this.commentForm.postId = articleId
        this.commentForm.rootId = rootId
        this.commentForm.toUserId = toUserId
        this.placeholderText = `回复${toUserName}`
      } else {
        bus.$emit('showLoginBox', '打开登录框')
      }

    },
    sendCommentRequest() {
      const articleId = this.$route.params.id
      this.commentForm.content = this.subComment
      this.request.post("http://localhost:9505/comments/sendComment", this.commentForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.loadComments(articleId)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    deleteComment(id, type) {
      this.request.post(`http://localhost:9505/comments/removeComment?id=${id}&type=${type}`).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.loadComments(this.$route.params.id)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    deleteArticle() {
      this.$confirm('确定删除该文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post('http://localhost:9505/article/delete?id=' + this.$route.params.id).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.$router.push('/')
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {

      });
    },
    followUser() {
      if (this.article.user.id) {
        var followedId = this.article.user.id
        this.followUserForm.followed = followedId
        this.followUserForm.followType = 'User'
        this.followUserForm.userId = this.loginUserInfo.id
        if (followedId === this.loginUserInfo.id) {
          this.$message.error("你不能关注自己哦~😢")
        } else {
          this.request.post("http://localhost:9505/follow/user", this.followUserForm).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.checkUserIsFollow(this.article.user.id, this.loginUserInfo.id)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      } else {
        this.$message.error("系统出错！")
      }

    },
    cancelFollow() {
      var FollowForm = {
        followed: this.article.user.id,
        userId: this.loginUserInfo.id,
        followType: 'User'
      }
      this.request.post("http://localhost:9505/follow/cancelFollow", FollowForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.checkUserIsFollow(this.article.user.id, this.loginUserInfo.id)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkUserIsFollow(authorId, userId) {
      this.request.get("http://localhost:9505/follow/checkUserIsFollow", {
        params: {
          followed: authorId,
          userId: userId
        }
      }).then(res => {
        if (res.code === 200) {
          this.userIsFollow = res.result.isFollow
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
@import "~mavon-editor/dist/markdown/github-markdown.min.css";

.br5 {
  border-radius: 5px;
}

.br50 {
  border-radius: 50%;
}

.mr8 {
  margin-right: 8px;
}

.mr16 {
  margin-right: 16px;
}

.el-header {
  background-color: #fff;
  height: 64px !important;
  line-height: 64px;
  padding: 0;
}

.el-main {
  background-color: #f5f5f5;
}

.article-title h1 {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  color: #262626;
  padding: 8px 0;

}

.article-user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 16px auto 0;
}

.article-user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info {
  flex-grow: 1;
  margin-right: 10px;
  cursor: default;
}

.user-name a {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #4ab3e0;
  text-decoration: none;
}

.sub-user-info {
  display: inline-block;
  margin-right: 8px;
}

.sub-user-info a {
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: #4ab3e0;
  text-decoration: none;
}

.sub-toUser-info {
  display: inline;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-right: 8px;
}

.user-jump-link {
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: #4ab3e0;
  text-decoration: none;
  margin-right: 8px;
}

.post-info {
  font-size: 14px;
  color: #8c8c8c;
}

.taglist-box {
  margin: 16px 0;
}

.el-tag {
  margin-right: 8px;
}

.el-tag a {
  text-decoration: none;
  color: #8c8c8c
}

.post-info span {
  margin: 0 10px 0 0;
  color: #8c8c8c;
  font-size: 14px;
}

.post-info i {
  color: #8c8c8c;
  font-size: 14px;
}

.article-box {
  background-color: #fff;
  padding: 10px 20px 20px;
}


.article-content {
  margin-top: 12px;
}

.markdown-body p img {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.article-footer {
  display: flex;
  margin-top: 20px;
  align-items: center;
}

.box-card {
  border: none;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
}

.comment-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0 16px;
}

.comment-info {
  height: 24px;
  line-height: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.comment-info span {
  font-size: 13px;
  color: #8c8c8c;
}

.comment-time {
  margin-right: 20px;
}

.root-comment-container {
  display: flex;
  flex-direction: row;
}

.root-user-avatar {
  flex-grow: 0;
}

.root-user-avatar img {
  width: 36px;
  height: 36px;
}

.root-comment-right {
  flex-grow: 1;
}

.like-button img {
  width: 16px;
  height: 16px;
}

.root-user-info a {
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: #4ab3e0;
  text-decoration: none;
}

.comment-content {
  font-size: 14px;
  line-height: 24px;
  display: inline-block;

}

.comment-content p {
  display: inline;
}

.sub-comment-container {

  background-color: #fafbfc;
  padding: 16px;
}

.sub-comment-item {
  display: flex;
}

.sub-user-avatar img {
  width: 24px;
  height: 24px;
}

.like-button {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}

.sub-edit-comment {
  display: flex;
}

.user-count {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.user-count-item {
  width: 100%;
}

.user-count-item h3 {
  text-align: center;
  font-size: 20px;
  line-height: 20px;
  font-weight: 400;
}

.user-count-item p {

  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  line-height: 12px;
  color: #8c8c8c;
}

.related-card {
  height: 50px;
  margin-bottom: 16px;
}

.related-card a {
  height: 100%;
  text-decoration: none;

}

.relatedArticle-box {
  height: 100%;
  display: flex;
}

.relatedArticle-box img {
  width: 75px;
  min-width: 75px;
  border-radius: 5px;
  margin-right: 8px;
  object-fit: cover;
}

.relatedArticle-box p {
  display: -webkit-box;
  font-size: 14px;
  color: #333;
  line-height: 21px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 5px 0;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
