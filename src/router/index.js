import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import modelList from "../views/home/modelList.vue"
import viewModel from "../views/home/viewModel.vue"
import personalHome from "@/views/personalCenter/personalHome";
import personalModelManagement from "@/views/personalCenter/personalModelManagement";
import personalOrders from "@/views/personalCenter/personalOrders";
import modelEnsemble from "@/views/personalCenter/modelEnsemble";
import changePassword from "@/views/personalCenter/changePassword";
import basicInfo from "@/views/personalCenter/basicInfo";
import managementHome from "@/views/management_center/managementHome";
import charge from "@/views/personalCenter/charge";

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
    redirect: '/personalModelManagement',
    children: [
      { path: '/personalModelManagement', component: personalModelManagement },
      { path: '/personalOrders', component: personalOrders },
      { path: '/modelEnsemble', component: modelEnsemble },
      { path: '/changePassword', component: changePassword },
      { path: '/basicInfo', component: basicInfo },
      { path: '/charge', component: charge },
    ]
  },
  {
    path: '/managementHome',
    name: 'managementHome',
    component: managementHome,
    redirect: '/managementInfo',
    children: [
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
