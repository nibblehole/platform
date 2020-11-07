<template>
  <div class="wrapper">
    <div class="content">
      <div class="headblock">
        <header class="wd12">
          <div class="logo">Syncloud</div>
          <div class="menulinks" v-if="loggedIn">
            <a href="index.html" class="apps hlink">Apps</a>
            <a href="appcenter.html" class="appcenter hlink">App Center</a>
            <a href="settings.html" class="settings hlink active">Settings</a>
          </div>
          <div class="menuoff" v-if="loggedIn">
            <a href="#" id="btn_logout_large" class="hlink">
              <i class="material-icons">exit_to_app</i>
              <span class="button_label">Logout</span>
            </a>
            <a href="#" id="btn_restart_large" class="hlink">
              <i class="material-icons">loop</i>
              <span class="button_label">Restart</span>
            </a>
            <a href="#" id="btn_shutdown_large" class="hlink">
              <i class="material-icons">power_settings_new</i>
              <span class="button_label">Shutdown</span>
            </a>
          </div>
          <div class="menubutton">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </header>
        <div class="navi">
          <a href="index.html" v-if="loggedIn">Apps</a>
          <a href="appcenter.html" v-if="loggedIn">App Center</a>
          <a href="settings.html" v-if="loggedIn">Settings</a>
          <div class="menucolor2">
            <a href="#" id="btn_logout_small" v-if="loggedIn" @click="logout">Log out</a>
            <a href="#" id="btn_restart_small" v-if="loggedIn">Restart</a>
            <a href="#" id="btn_shutdown_small" v-if="loggedIn">Shutdown</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Menu',
  props: {
    activeTab: String,
    loggedIn: Boolean,
    onLogout: Function
  },
  methods: {
    logout: function (_) {
      axios.post('/rest/logout')
        .then(_ => {
          this.onLogout()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}

</script>
<style>
</style>
