<template>
  <div class="wrapper">
    <div class="content">
      <div class="headblock">
        <header class="wd12">
          <div class="logo">Syncloud</div>
          <div class="menulinks">
            <a href="index.html" class="apps hlink">Apps</a>
            <a href="appcenter.html" class="appcenter hlink">App Center</a>
            <a href="settings.html" class="settings hlink active">Settings</a>
          </div>
          <div class="menuoff">
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
          <a href="index.html">Apps</a>
          <a href="appcenter.html">App Center</a>
          <a href="settings.html">Settings</a>
          <div class="menucolor2">
            <a href="#" id="btn_logout_small">Log out</a>
            <a href="#" id="btn_restart_small">Restart</a>
            <a href="#" id="btn_shutdown_small">Shutdown</a>
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
    email: String,
    loggedIn: Boolean,
    onLogout: Function
  },
  methods: {
    logout: function (_) {
      axios.post('/api/logout')
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
.navbar-brand {
  line-height: 80px !important;
  height: 80px !important;
  padding-top: 0 !important;
  font-size: 32px !important;
}

.navbar-inverse .navbar-brand {
  color: #fff !important;
}

.navbar-brand span {
  padding-left: 10px !important;
}

.navbar-nav > li > span {
  padding-left: 15px !important;
}

.navbar-nav li, .navbar-nav li a {
  padding-top: 0 !important;
  font-size: 18px !important;
}

.navbar-nav li, .navbar-nav li a {
  line-height: 80px !important;
  height: 80px !important;
}

@media (max-width: 767px) {
  .navbar-nav li, .navbar-nav li a {
    line-height: 30px !important;
    height: 30px !important;
  }
}
.invisible {
  display: none !important;
}
</style>
