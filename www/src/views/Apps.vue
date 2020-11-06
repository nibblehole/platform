<template>
  <div class="wrapper">

    <div class="content">
      <div class="block1 wd12" id="block1">
        <h1 class="bigh1">Applications</h1>
        <div class="row-no-gutters appcenterlist" id="block_apps">
          <% if (apps.length == 0) { %>
          <h2 class="bh2">You don't have any installed apps yet. You can install one from App Center</h2>
          <a href="appcenter.html" class="appcenterh">App Center</a>
          <% } %>

          <%for (s=0; s < apps.length; s++) {
          var app = apps[s]; %>

          <% if (app.id != "store" && app.id != "settings") { %>
          <a href="app.html?app_id=<%= app.id %>" class="colapp app">
            <img src="<%= app.icon %>" class="appimg">
            <div class="appname"><span class="withline"><%= app.name %></span></div>
            <div class="appdesc"></div>
          </a>
          <% } %>

          <% } %>`
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import * as _ from 'underscore';
import $ from 'jquery';
import jQuery from 'jquery';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-switch';
import 'bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css';
import 'font-awesome/css/font-awesome.css'
import '../css/site.css'
import '../css/material-icons.css'
import * as UiCommon from './ui/common.js'
import './ui/menu.js'
import Common from './common.js'
import Templates from './index.templates.js'

function installed_apps(on_complete, on_error) {
  $.get('/rest/installed_apps').done(on_complete).fail(on_error);
}

function display_apps(data) {
  let html = _.template(Templates.IndexTemplate)(data);
  $("#block_apps").html(html);
}



export default {
  name: 'Apps',
  props: {
    activeTab: String,
    email: String,
    loggedIn: Boolean,
    onLogout: Function
  },
  mounted() {
      UiCommon.check_activation_status()
      installed_apps(
          display_apps,
          UiCommon.ui_display_error)
  }
}
</script>
<style>
</style>
