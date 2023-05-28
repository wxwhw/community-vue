<template>
  <div class="main">
    <el-container>
      <el-header>
        <FrontHeader></FrontHeader>
      </el-header>

      <el-main>
        <div class="main-box">
          <div>
            <h2 style="text-align: center; margin: 20px; ">社区列表</h2>
          </div>
          <div class="result-box">
            <div class="community-list">
              <div class="community-item" v-for="community in communityList">
                <el-card class="box-card" shadow="hover">
                  <div class="community-card">
                    <div class="community-info-box">
                      <div class="community-name">
                        <a :href="`/community/${community.id}`">{{ community.name }}</a>
                      </div>
                      <div class="community-description">
                        <p>{{ community.description }}</p>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>


            <div class="block" style="background-color: #fff;padding: 20px;">
              <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
                layout="prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>

          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FrontHeader from '@/components/FrontHeader.vue';
export default {
  components: {
    FrontHeader
  },
  created() {
    this.loadCommunityList()
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 12,
      total: 0,
      communityList:[]
    }
  },
  computed: {
    ...mapState(['loginUserInfo'])
  },
  methods: {
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.loadCommunityList()
    },
    loadCommunityList() {
      this.request.get("/postType/page", {
        // 查询参数
        params: {
          name: '',
          scope: '',
          auditState: '',
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        if (res.code === 200) {
          this.communityList = res.result.allPostTypes
          this.total = res.result.total
        } else {
          this.$message.error(res.msg)
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

.community-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.community-item {
  box-sizing: border-box;
  width: 33.3%;
  padding: 0 8px 16px;
}

.community-name {
  margin-bottom: 16px;
}

.community-name a {
  text-decoration: none;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.community-description p {
  font-size: 14px;
  color: #8c8c8c;
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
</style>
