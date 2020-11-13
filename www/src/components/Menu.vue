<template>
  <div class="wrapper">
    <div class="content">
      <div class="headblock">
        <header class="wd12" v-click-outside="close">
          <div class="logo" :class="{ onelogo: !loggedIn }">Syncloud</div>
          <div class="menulinks" v-if="loggedIn">
            <router-link to="/" class="apps hlink">Apps</router-link>
            <router-link to="/appcenter" class="appcenter hlink">App Center</router-link>
            <router-link to="/settings" class="settings hlink active">Settings</router-link>
          </div>
          <div class="menuoff" v-if="loggedIn">
            <a href="#" id="btn_logout_large" class="hlink" @click="logout">
              <i class="material-icons">exit_to_app</i>
              <span class="button_label">Logout</span>
            </a>
            <a href="#" id="btn_restart_large" class="hlink" @click="restart">
              <i class="material-icons">loop</i>
              <span class="button_label">Restart</span>
            </a>
            <a href="#" id="btn_shutdown_large" class="hlink" @click="shutdown">
              <i class="material-icons">power_settings_new</i>
              <span class="button_label">Shutdown</span>
            </a>
          </div>
          <div class="menubutton" v-if="loggedIn" @click="toggle"  :class="{ menuopen: menuOpen }">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </header>
        <div class="navi" v-if="loggedIn" :class="{ naviopen: menuOpen }" >
          <router-link to="/"><span style="display: block" @click="toggle">Apps</span></router-link>
          <router-link to="/appcenter"><span style="display: block" @click="toggle">App Center</span></router-link>
          <router-link to="/settings"><span style="display: block" @click="toggle">Settings</span></router-link>
          <div class="menucolor2">
            <a href="#" id="btn_logout_small" @click="logout">Log out</a>
            <a href="#" id="btn_restart_small" @click="restart">Restart</a>
            <a href="#" id="btn_shutdown_small" @click="shutdown">Shutdown</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as UiCommon from '../js/ui/common'
import $ from 'jquery'

export default {
  props: {
    activeTab: String,
    loggedIn: Boolean,
    onLogout: Function
  },
  data () {
    return {
      menuOpen: false
    }
  },
  methods: {
    close: function (event) {
      this.menuOpen = false
    },
    toggle: function (event) {
      this.menuOpen = !this.menuOpen
      event.preventDefault()
    },
    logout: function (_) {
      axios.post('/rest/logout')
        .then(_ => {
          this.onLogout()
        })
        .catch(err => {
          console.log(err)
        })
    },
    restart: function () {
      $.post('/rest/restart')
        .done(_ => {
        })
        .fail(UiCommon.uiDisplayError)
    },
    shutdown: function () {
      $.post('/rest/shutdown')
        .done(_ => {
        })
        .fail(UiCommon.uiDisplayError)
    }
  }
}

</script>
<style>
</style>
