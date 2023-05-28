<template>
	<div class="main">
		<el-container>
			<el-header>
				<FrontHeader></FrontHeader>
			</el-header>

			<el-main>
				<div class="main-box">
					<div>
						<h2 style="text-align: center; margin: 20px; ">搜索关键词：{{ this.searchText }}</h2>
					</div>
					<div class="result-box">
						<el-tabs v-model="activeName" @tab-click="handleClick">
							<el-tab-pane label="文章" name="article">
								<SearchArticleList :searchText="this.searchText" v-if="activeName === 'article'"></SearchArticleList>
							</el-tab-pane>
							<el-tab-pane label="用户" name="user">
								<SearchUserList :searchText="this.searchText" v-if="activeName === 'user'"></SearchUserList>
							</el-tab-pane>
							<el-tab-pane label="社区" name="community">
								<SearchTypeList :searchText="this.searchText" type="community" v-if="activeName === 'community'"></SearchTypeList>
							</el-tab-pane>
							<el-tab-pane label="标签" name="tag">
								<SearchTypeList :searchText="this.searchText" type="tag" v-if="activeName === 'tag'"></SearchTypeList>
							</el-tab-pane>
						</el-tabs>
					</div>
				</div>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import FrontHeader from '@/components/FrontHeader.vue';
import SearchArticleList from '@/components/SearchArticleList.vue';
import SearchUserList from '@/components/SearchUserList'
import SearchTypeList from '@/components/SearchTypeList'
export default {
	created() {
		this.searchText = this.$route.query.searchText
	},
	components: {
		FrontHeader,
		SearchArticleList,
		SearchUserList,
		SearchTypeList
	},
	computed: {
		...mapState(['loginUserInfo'])
	},
	data() {
		return {
			searchText: '',
			activeName: 'article'
		}
	},
	methods: {
		handleClick(tab, event) {

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

.search-box {
	width: 60%;
	margin: 0 auto 16px;
}

.result-box {
	background-color: #fff;
	padding: 20px;
}
</style>
