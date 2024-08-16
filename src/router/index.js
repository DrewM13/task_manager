import Vue from 'vue'
import VueRouter from 'vue-router'
import VueJwtDecode  from 'vue-jwt-decode'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('jwtoken');

    if (to.matched.some(record => record.name)) {
      if (!token || isTokenExpired(token)) {
        next('/login');
      } else {
        next();
      }
    } else {
      next();
    }
  });

  function isTokenExpired(token) {
    if (!token) return true;
    try {
      let decoded = VueJwtDecode.decode(token)
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch (error) {
      console.error('Token inválido:', error);
      return true;
    }
  }


  return Router
}
