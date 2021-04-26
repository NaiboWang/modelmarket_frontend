import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import modelList from "../views/home/modelList.vue"
import viewModel from "../views/home/viewModel.vue"
import personalHome from "@/views/personalCenter/personalHome";
import personalModelList from "@/views/personalCenter/personalModelList";
import personalOrders from "@/views/personalCenter/personalOrders";
import modelEnsemble from "@/views/personalCenter/modelEnsemble";
import changePassword from "@/views/personalCenter/changePassword";
import basicInfo from "@/views/personalCenter/basicInfo";
import managementHome from "@/views/management_center/managementHome";
import charge from "@/views/personalCenter/charge";
import modelManagement from "@/views/personalCenter/modelManagement";
import viewOrder from "@/views/personalCenter/viewOrder";
import viewWaitingList from "@/views/personalCenter/viewWaitingList";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/modelList',
    children: [
      { path: '/modelList', component: modelList },
      { path: '/viewModel/:id', component: viewModel },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  },
  {
    path: '/personalHome',
    name: 'personalHome',
    component: personalHome,
    redirect: '/personalModelList',
    children: [
      { path: '/personalModelList', component: personalModelList },
      { path: '/manageModel/:id', component: modelManagement },
      { path: '/personalOrders', component: personalOrders },
      { path: '/soldOrders', component: personalOrders },
      { path: '/viewOrder/:id', component: viewOrder },
      { path: '/viewSoldOrder/:id', component: viewOrder },
      { path: '/modelEnsemble', component: modelEnsemble },
      { path: '/changePassword', component: changePassword },
      { path: '/basicInfo', component: basicInfo },
      { path: '/viewWaitingList', component: viewWaitingList },
      { path: '/charge', component: charge },
    ]
  },
  {
    path: '/managementHome',
    name: 'managementHome',
    component: managementHome,
    redirect: '/managementInfo',
    children: [
      { path: '/managementModels', component: personalModelList},
      { path: '/managementPassword', component: changePassword },
      { path: '/managementInfo', component: basicInfo },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
