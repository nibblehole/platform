<template>
  <div class="wrapper">
    <div class="content">
      <div class="block1 wd12" id="block1">
        <h1 class="bigh1">App Center</h1>
        <div class="row-no-gutters appcenterlist" id="block_apps">
          <router-link v-for="(app, index) in apps" :key="index" :to="'/app?id=' + app.id" class="colapp app">
            <img :src="app.icon" class="appimg" alt="">
            <div class="appname"><span class="withline">{{ app.name }}</span></div>
            <div class="appdesc"></div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <Error ref="error"/>
</template>

<script>
import $ from 'jquery'
import 'bootstrap'
import 'bootstrap-switch'
import * as Common from '../js/common.js'
import Error from '@/components/Error'

export default {
  name: 'AppCenter',
  data () {
    return {
      apps: undefined
    }
  },
  components: {
    Error
  },
  mounted () {
    const error = this.$refs.error
    const that = this
    $.get('/rest/available_apps')
      .done(
        (data) => {
          Common.checkForServiceError(
            data,
            function () {
              that.apps = data.apps
            },
            (xhr) => error.show(xhr))
        })
      .fail((xhr) => error.show(xhr))
  }
}
</script>
<style>
@import '../style/site.css';
@import '../style/material-icons.css';
</style>
