<template>
  <div class="wrapper">
    <div class="content">
      <div class="block1 wd12" id="block1">
        <h1 class="bigh1">Applications</h1>
        <div v-if="apps !== undefined">
          <div class="row-no-gutters appcenterlist" id="block_apps">
            <div v-if="apps.length === 0">
              <h2 class="bh2">You don't have any installed apps yet. You can install one from App Center</h2>
              <router-link to="/appcenter" class="appcenterh">App Center</router-link>
            </div>
            <router-link v-for="(app, index) in apps" :key="index" :to="'/app?id=' + app.id" class="colapp app">
              <img :src="app.icon" class="appimg" :alt="app.name">
              <div class="appname"><span class="withline">{{ app.name }}</span></div>
              <div class="appdesc"></div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'Apps',
  data () {
    return {
      apps: undefined
    }
  },
  mounted () {
    const error = this.$refs.error

    $.get('/rest/installed_apps')
      .done(data => {
        if ('apps' in data) {
          this.apps = data.apps
        }
      })
      .fail((xhr, textStatus, errorThrown) => error.show(xhr))
  }
}
</script>
<style>
@import '../style/site.css';
@import '../style/material-icons.css';
</style>
