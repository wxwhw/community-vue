<template>
	<div class="main">
		<el-container>
			<el-header>
				<FrontHeader></FrontHeader>
			</el-header>

			<el-main>
				<el-row :gutter="20">
					<!-- 左边内容 -->
					<el-col :xs="24" :sm="16" :md="{ span: 14, offset: 1 }" :lg="{ span: 13, offset: 2 }"
						:xl="{ span: 10, offset: 5 }">

						<!-- 首页轮播图 -->
						<div class="carousel-container" ref="carouselContainer">
							<el-carousel :interval="4000" type="card" ref="carousel" :height="bannerHeight + 'px'">
								<el-carousel-item v-for="item in carouselList" :key="item.id" v-if="item.imgUrl">
									<a :href="item.actUrl" target="_blank">
										<img :src="item.imgUrl" alt=""
											style="width: 100%; height: inherit; border-radius: 5px;">
										<div class="carousel-title">
											<p>{{ item.title }}</p>
										</div>
									</a>

								</el-carousel-item>
							</el-carousel>
						</div>

						<div class="article-list" style="background-color: #fff; border-radius: 5px;">
							<!-- item开始 -->
							<div class="article-item" v-for="article in articleList">
								<div class="article-item-header"
									style="display: flex; margin-bottom: 8px; align-items: center;">
									<div class="user-info" style="display: flex; align-items: center; margin: 0 8px 0 0;">
										<img :src="`http://localhost:9505/${article.user.avatar}`" alt=""
											style="width: 24px;height: 24px;border-radius: 50%; margin-right: 8px;">
										<a :href="`/user/${article.user.id}`">{{ article.user.nickname }}</a>
									</div>
									<div class="article-info">
										<p>{{ article.createAt }} · <a :href="`/community/${article.articleType.id}`">{{
											article.articleType.name }}</a></p>
									</div>
									<!-- <div class="follow-btn">
										<el-button icon="el-icon-plus" type="primary" round size="mini"
											@click="checkLogin">关注</el-button>
									</div> -->
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
											:src="`http://localhost:9505/${article.coverUrl}`"
											:preview-src-list="urlToArray(article.coverUrl)">
										</el-image>
										<!-- <img :src="`http://localhost:9505/${article.coverUrl}`" alt="" width="160" height="90"> -->
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
							<el-pagination @current-change="handleCurrentChange" :current-page="pageNum"
								:page-size="pageSize" layout="prev, pager, next, jumper" :total="total">
							</el-pagination>
						</div>
					</el-col>

					<!-- 右边内容 -->
					<el-col :xs="0" :sm="8" :md="8" :lg="7" :xl="4">
						<div class="card-box">
							<el-card shadow="never">
								<div class="btn-box">

									<el-button type="primary" icon="el-icon-edit"
										@click="checkLoginBeforePublish">发布文章</el-button>

								</div>
							</el-card>
						</div>

						<!-- <div class="card-box">
							<el-card shadow="never">
								<div slot="header">
									<span class="card-title">通知公告</span>
									<el-button style="float: right; padding: 3px 0" type="text" size="medium">更多</el-button>
								</div>
								<div v-for="o in 4" :key="o" class="text item">
									{{ '列表内容 ' + o }}
								</div>
							</el-card>
						</div> -->

						<!-- <div class="advertise br5 mb20">
							<a href="#">
								<img src="http://localhost:9505/imgUrl/633dec1ea77943ef98a966195188d156/002.jpg" alt=""
									style="width: 100%; border-radius: 5px;">
							</a>
						</div> -->

						<div class="card-box">
							<el-card shadow="never">
								<div slot="header">
									<span class="card-title">官方文章</span>
								</div>
								<div class="related-card" v-for="item in officialArticleList" :key="item.id">
									<a :href="`/article/${item.id}`" target="_blank">
										<div class="relatedArticle-box">
											<img :src="`http://localhost:9505/${item.coverUrl}`" alt=""
												v-if="item.coverUrl != ''">
											<p>{{ item.title }}</p>
										</div>
									</a>
								</div>
							</el-card>
						</div>

						<div class="card-box">
							<el-card shadow="never">
								<div slot="header">
									<span class="card-title">热门标签</span>
								</div>
								<div v-for="tag in hottagList" :key="tag.id" class="article-type-item"
									style="display: inline-block; margin-bottom: 8px;">
									<a :href="`/tag/${tag.id}`" target="_blank" rel="noopener noreferrer">
										<el-tag size="mini" :type="randomType()" effect="plain"
											style="margin-right: 8px;">{{ tag.name }}</el-tag>
									</a>
								</div>
							</el-card>
						</div>


					</el-col>
				</el-row>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import { bus } from '../utils/event-bus.js'
import FrontHeader from '@/components/FrontHeader.vue';
import Cookies from 'js-cookie'
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';
export default {
	mounted() {
		// 首次加载时,初始化高度
		var containerWidth = this.$refs.carouselContainer.offsetWidth
		this.bannerHeight = containerWidth * 9 / 16 * 0.5
		// 窗口大小发生改变
		window.onresize = () => {
			containerWidth = this.$refs.carouselContainer.offsetWidth
			this.bannerHeight = containerWidth * 9 / 16 * 0.5
		}
	},
	computed: {
		...mapGetters(['isLogin'])
	},
	created() {
		var isLogin = Cookies.get('isLogin')
		if (isLogin) {
			this.setLogin(true)
		} else {
			this.setLogin(false)
		}
		this.loadArticle()
		this.loadCarousel()
		this.getHotTags()
		this.loadOfficialArticle()
	},
	data() {
		return {
			baseUrl: 'http://localhost:9505/',
			total: 0,
			pageNum: 1,
			pageSize: 5,
			bannerHeight: 0,
			screenWidth: 0,
			articleList: [],
			carouselList: [],
			hottagList: [],
			officialArticleList: []
		}
	},
	components: {
		FrontHeader
	},
	methods: {
		...mapActions(['setLogin']),
		loadArticle() {
			return this.request.get("/article/allArticles", {
				params: {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					auditState: 'PASS'
				}
			}).then(res => {
				if (res.code === 200) {
					this.articleList = res.result.articleList
					this.total = res.result.total
					// console.log(this.articleList);
					for (const article of this.articleList) {
						article.description = this.transferHtmlToStr(article.htmlContent).substr(0, 200)
					}
				} else {
					this.$message.error('加载文章列表失败~')
				}
			})
		},
		handleCurrentChange(pageNum) {
			this.pageNum = pageNum
			this.loadArticle()
		},
		checkLogin() {
			if (this.isLogin) {
				console.log('已登录');
			} else {
				bus.$emit('showLoginBox', '打开登录框')
			}
		},
		checkLoginBeforePublish() {
			if (this.isLogin) {
				this.$router.push('/editor')
			} else {
				bus.$emit('showLoginBox', '打开登录框')
			}
		},
		transferHtmlToStr(htmlStr) {
			let theConvertDiv = document.createElement("div")
			theConvertDiv.innerHTML = htmlStr
			return theConvertDiv.textContent || theConvertDiv.innerText || ""
		},
		urlToArray(url) {
			var urlList = []
			urlList.push(this.baseUrl + url)
			return urlList
		},
		loadCarousel() {
			this.request.get("http://localhost:9505/carousel/carouselList").then(res => {
				if (res.code === 200) {
					this.carouselList = res.result
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		randomType() {
			var types = ['', 'success', 'info', 'danger', 'warning']
			var index = Math.floor(Math.random() * types.length)
			return types[index]
		},
		getHotTags() {
			this.request.get('http://localhost:9505/tag/hottag').then(res => {
				if (res.code === 200) {
					this.hottagList = res.result
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		loadOfficialArticle() {
			this.request.get('http://localhost:9505/article/allArticles', {
				params: {
					pageNum: 1,
					pageSize: 5,
					auditState: 'PASS',
					title: '',
					typeId: '',
					official: 1,
					top: '',
					marrow: '',
					authorId: ''
				}
			}).then(res => {
				if (res.code === 200) {
					this.officialArticleList = res.result.articleList
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
@media screen and (max-width:768px) {
	.el-main {
		padding: 0;
	}
}

.el-header {
	background-color: #fff;
	height: 64px !important;
	line-height: 64px;
	padding: 0;
}

.carousel-container {
	overflow: hidden;
	width: 100%;
	margin-bottom: 16px;
}

.el-carousel__item {
	border-radius: 5px;
}

.carousel-title {
	width: 100%;
	position: absolute;
	bottom: 16px;
	display: flex;
	justify-content: center;
}

.carousel-title p {
	width: 80%;
	font-size: 20px;
	font-weight: 600;
	color: #fff;
	text-align: center;
	text-overflow: ellipsis;
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
}

/* .el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
	background-color: #d3dce6;
} */

.br5 {
	border-radius: 5px;
}

.mb20 {
	margin-bottom: 20px;
}

.el-main {
	background-color: #f5f5f5;
}

.article-item {
	padding: 20px;
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

.el-image /deep/ img {
	object-fit: cover;
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

.btn-box {
	display: flex;
	justify-content: center;
}

.card-box {
	border-radius: 5px;
	margin-bottom: 20px;
}

.card-title {
	font-size: 18px;
	font-weight: 600;
}

.el-card {
	border: none;
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
