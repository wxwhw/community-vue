import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import UserManageVue from '@/views/UserManage'
import DashboardVue from '@/views/Dashboard.vue'
import TagsManageVue from '@/views/TagsManage.vue'
import PostTypeManage from '@/views/PostTypeManage'
import LoginVue from '@/views/Login.vue'
import MycenterVue from '@/views/Mycenter.vue'
import EditorVue from '@/views/Editor.vue'
import RegisterVue from '@/views/Register.vue'
import ForgetPwd from '@/views/FgPwd.vue'
import ArticleView from '@/views/article/articleDetail.vue'
import indexVue from '@/views/index.vue'
import jsCookie from 'js-cookie'
import errorVue from '@/views/404.vue'
import postVue from '@/views/ArticleManage.vue'
import PersonDetailVue from '@/views/user/PersonDetail.vue'
import CommentManageVue from '@/views/CommentManage.vue'
import CarouselManageVue from '@/views/CarouselManage.vue'
import SearchVue from '@/views/SearchPage.vue'
import CommunityDetail from '@/views/CommunityDetail.vue'
import TagDetail from '@/views/TagDetail.vue'
import CommunityList from '@/views/CommunityList.vue'
import store from '@/utils/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    name: '用户端首页',
    component: indexVue
  },
  {
    path: '/user/:id',
    name: '用户个人中心',
    component: PersonDetailVue
  },
  {
    path: '/',
    name: '根路径',
    redirect: '/index'
  },
  {
    path: '/404',
    name: '404页面',
    component: errorVue
  },
  {
    path: '/admin',
    name: '管理后台',
    redirect: '/admin/home/dashboard'
  },
  {
    path: '/editor',
    name: '编辑器',
    component: EditorVue
  },
  {
    path: '/search',
    name: '搜索页',
    component: SearchVue,
    props: route => ({ searchText: route.query.searchText })
  },
  {
    path: '/admin/home',
    name: '首页',
    component: HomeView,
    children: [
      {
        path: 'dashboard',
        name: '仪表盘',
        component: DashboardVue,
      },
    ]
  },
  {
    path: '/admin/sys',
    name: '系统管理',
    component:
      // render(c) { return c('router-view') }
      HomeView
    ,
    children: [
      {
        path: 'users',
        name: '用户管理',
        component: UserManageVue,
      },
      {
        path: 'tags',
        name: '标签管理',
        component: TagsManageVue,

      },
      {
        path: 'postType',
        name: '分类管理',
        component: PostTypeManage,

      },
      {
        path: 'posts',
        name: '文章管理',
        component: postVue,
      },
      {
        path: 'comments',
        name: '评论管理',
        component: CommentManageVue
      },
      {
        path: 'carousel',
        name: '轮播图管理',
        component: CarouselManageVue
      }

    ]
  },
  {
    path: '/admin/center',
    name: '个人中心',
    component: HomeView,
    children: [
      {
        path: 'details',
        component: MycenterVue
      }
    ]
  },
  {
    path: '/article/:id',
    name: '文章详情页',
    component: ArticleView,
  },
  {
    path: '/community',
    name: '社区列表',
    component: CommunityList,
  },
  {
    path: '/community/:id',
    name: '社区详情页',
    component: CommunityDetail,
  },
  {
    path: '/tag/:id',
    name: '标签详情页',
    component: TagDetail,
    props:true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin')) {
    var isLogin = jsCookie.get('isLogin')
    var isAdmin = jsCookie.get('isAdmin')

    if (isLogin === 'true' && isAdmin === 'true') {
      next()
    } else {
      next('/404')
    }
  } else {
    next();
  } 
})


export default router
