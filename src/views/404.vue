<template>
	<div class="main">
		<el-container>
			<el-header>
				<FrontHeader></FrontHeader>
			</el-header>

			<el-main>
				<h1 style="text-align: center; padding: 32px 0; font-size: 48px;">404，您访问的页面不存在</h1>
			</el-main>

		</el-container>
	</div>
</template>

<script>
import FrontHeader from '@/components/FrontHeader.vue';
export default {
	data() {
		return {
		}
	},
	components: {
		FrontHeader
	},
}
</script>

<style scoped>
.el-header{
	height: 64px !important;
}

.main{
	height: 100%;
}

.el-main{
	padding: 0;
	height: calc(100vh - 64px);
}


</style>
