/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHistory} from 'vue-router'
import workerView from "@/pages/WorkerView.vue";
import userList from "@/components/Operations/UserList.vue";
import AdminView from "@/pages/AdminView.vue";
import ClientView from "@/pages/ClientView.vue";
import poliList from "@/components/Operations/PoliList.vue";
import poliCard from "@/components/Operations/PoliCard.vue";
import LR from "@/components/Operations/LR.vue";

const manualRoutes = [{
  path: '/workerview', component: workerView,
  children: [
    {path: 'polilist', component: poliList},
    {path: 'userlist', component: userList},
    ],

},
  {path: '/', component: LR},
  {
    path: '/adminview', component: AdminView, children: [
      {path: 'polilist', component: poliList},
      {path: 'userlist', component: userList},
      ]
  },
  {
    path: '/clientview', component: ClientView, children: [
      {path: 'policard', component: poliCard}]
  }]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: manualRoutes,
})


export default router
