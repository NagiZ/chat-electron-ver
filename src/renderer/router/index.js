import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/login/Homepage'
import Login from '@/components/login/Login'
import Register from '@/components/login/Register'
// import RegistChoice from '@/components/login/RegistChoice'
// import Back from '@/components/Back'
// import Ms from '@/components/Menusup'
import Index from '@/components/chat/IndexPanel'
import Room from '@/components/chat/Room'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage
    },
    // {
    //   path: '/registchoice',
    //   name: 'RegistChoice',
    //   component: RegistChoice
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register/:type',
      name: 'Register',
      component: Register
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/index/room/:id',
          name: 'Room',
          component: Room
        }
      ]
    }
  ]
})
