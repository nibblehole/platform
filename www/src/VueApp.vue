<template>
  <Menu v-bind:activeTab="currentPath" v-bind:onLogout="checkUserSession" v-bind:loggedIn="loggedIn"/>
  <router-view v-bind:onLogin="checkUserSession" v-bind:onLogout="checkUserSession"/>
  <Error ref="app_error"/>
</template>
<script>
import axios from 'axios'
import Menu from '@/components/Menu'
import Error from '@/components/Error'

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
  data () {
    return {
      currentPath: '',
      loggedIn: undefined,
      email: ''
    }
  },
  name: 'VueApp',
  components: {
    Menu,
    Error
  },
  watch: {
    $route (to, from) {
      console.log('route change from ' + from.path + ' to ' + to.path)
      this.currentPath = to.path
    }
  },
  methods: {
    onActivationStatusError: function (err) {
      this.$refs.app_error.showAxios(err)
      this.$router.push('/error')
    },
    onUserGet: function () {
      this.loggedIn = true
      if (this.currentPath === '/login') {
        this.$router.push('/')
      }
    },
    checkUserSession: function () {
      axios.get('/rest/user')
        .then(_ => {
          this.onUserGet()
        })
        .catch(_ => {
          axios.get('/rest/activation_status')
            .then(response => {
              this.onActivationStatus(response.data)
            })
            .catch(err => {
              this.onActivationStatusError(err)
            })
        })
    },
    onActivationStatus: function (data) {
      if (!data.activated) {
        this.$router.push('/activate')
      } else {
        this.loggedIn = false
        if (!publicRoutes.includes(this.currentPath)) {
          console.log('redirect to login from ' + this.currentPath)
          this.$router.push('/login')
        }
      }
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
