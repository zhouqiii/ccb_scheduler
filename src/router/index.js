import Vue from 'vue';
import VueRouter from 'vue-router';
import clipboard from '../views/clipboard.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: clipboard,
  },
  {
    path: '/log',
    name: 'log',
    component: () => import(/* webpackChunkName: "view" */ '../views/logView.vue'),
  },
  {
    path: '/gantt',
    name: 'gantt',
    component: () => import(/* webpackChunkName: "view" */ '../views/ganttView.vue'),
  },
  {
    path: '/tree',
    name: 'tree',
    component: () => import(/* webpackChunkName: "view" */ '../views/treeView.vue'),
  },
  {
    path: '/dag/definition',
    name: 'dag/definition',
    component: () => import(/* webpackChunkName: "dag" */ '../views/Dag/create.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
