<template>
  <Menu v-bind:activeTab="currentPath" v-bind:onLogout="checkUserSession" v-bind:loggedIn="loggedIn"/>
  <router-view v-bind:onLogin="checkUserSession" v-bind:onLogout="checkUserSession"/>
</template>
<script>
import axios from 'axios'
import Menu from '@/components/Menu'

// TODO: migrate to any Material Design UI frameworks for Vue v3 when they become available.
global.jQuery = require('jquery')
var $ = global.jQuery
window.jQuery = window.$ = $

const publicRoutes = [
  '/activate',
  '/error',
  '/login'
]

export default {
  data: function () {
    return {
      currentPath: '',
      loggedIn: undefined,
      email: ''
    }
  },
  name: 'VueApp',
  components: {
    Menu
  },
  watch: {
    $route (to, from) {
      console.log('route change from ' + from.path + ' to ' + to.path)
      this.currentPath = to.path
    }
  },
  methods: {
    checkUserSession: function () {
      axios.get('/rest/user')
        .then(response => {
          this.loggedIn = true
          if (this.currentPath === '/login') {
            this.$router.push('/')
          }
        })
        .catch(_ => {
          axios.get('/rest/activation_status')
            .then(response => {
              if (!response.activated) {
                this.$router.push('/activate')
              }
              this.loggedIn = false
              if (!publicRoutes.includes(this.currentPath)) {
                console.log('redirect to login from ' + this.currentPath)
                this.$router.push('/login')
              }
            }).catch(error => {
            }
          )
        })
    }
  },
  mounted () {
    this.checkUserSession()
  }
}
</script>
<style>
@import '~bootstrap/dist/css/bootstrap.css';
@import '~bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css';
@import '~font-awesome/css/font-awesome.css';
</style>
