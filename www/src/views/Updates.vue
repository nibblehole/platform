<template>

  <div class="wrapper">
    <div class="content">
      <div class="block1 wd12" id="block1">
        <h1>Updates</h1>
        <div class="row-no-gutters settingsblock">
          <div class="col2">
            <div class="setline">
              <button
                @click="checkVersions"
                class="buttongreen bwidth smbutton btn-lg" id="btn_check_updates"
                data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Checking..."
                :disabled="progress"
              >Check for updates
              </button>
            </div>
            <div class="setline">
              <span class="span">Current system version: </span>
              <span id="txt_platform_version" style="padding-right: 10px">{{ platformVersion }}</span>
              <button
                v-if="platformVersion !== platformVersionAvailable"
                id="btn_platform_upgrade"
                @click="upgradePlatform"
                class="buttongreen bwidth smbutton btn-lg"
                :data-loading-text="'<i class=\'fa fa-circle-o-notch fa-spin\'></i> Upgrading to ' + platformVersionAvailable + ' ...'"
                :disabled="progress"
              >
                Upgrade to {{ platformVersionAvailable }}
              </button>
            </div>
            <div class="setline">
              <span class="span">Current installer version: </span>
              <span id="txt_installer_version" style="padding-right: 10px">{{ installerVersion }}</span>
              <button
                v-if="installerVersion !== installerVersionAvailable"
                id="btn_installer_upgrade"
                @click="upgradeInstaller"
                class="buttongreen bwidth smbutton btn-lg"
                :data-loading-text="'<i class=\'fa fa-circle-o-notch fa-spin\'></i> Upgrading to ' + installerVersionAvailable + ' ...'"
                :disabled="progress"
              >
                Upgrade to {{ installerVersionAvailable }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Error ref="error"/>

</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import 'bootstrap'
import 'bootstrap-switch'
import * as Common from '../js/common.js'
import Error from '@/components/Error'

export default {
  name: 'Updates',
  components: {
    Error
  },
  props: {
    onLogin: Function,
    onLogout: Function
  },
  data () {
    return {
      platformVersion: undefined,
      platformVersionAvailable: undefined,
      installerVersion: undefined,
      installerVersionAvailable: undefined,
      progress: false
    }
  },
  mounted () {
    this.checkVersions()
  },
  methods: {
    upgradePlatform () {
      this.progress = true
      const btn = $('#btn_platform_upgrade')
      btn.button('loading')
      const that = this
      const onError = (err) => {
        that.$refs.error.showAxios(err)
        btn.button('reset')
      }

      axios.post('/rest/upgrade', null, { params: { app_id: 'platform' } })
        .then((resp) => {
          Common.checkForServiceError(resp.data, () => {
            Common.runAfterJobIsComplete(
              setTimeout,
              this.checkVersions,
              onError,
              Common.INSTALLER_STATUS_URL,
              Common.DEFAULT_STATUS_PREDICATE)
          }, onError)
        })
        .catch(onError)
    },
    upgradeInstaller () {
      this.progress = true
      const btn = $('#btn_installer_upgrade')
      btn.button('loading')
      const that = this
      const onError = err => {
        that.$refs.error.showAxios(err)
        btn.button('reset')
      }

      axios.post('/rest/installer/upgrade')
        .then((resp) => {
          Common.checkForServiceError(resp.data, () => {
            Common.runAfterJobIsComplete(
              setTimeout,
              this.checkVersions,
              onError,
              Common.JOB_STATUS_URL,
              Common.JOB_STATUS_PREDICATE)
          }, onError)
        })
        .catch(onError)
    },
    findApp (appsData, appId) {
      for (const data of appsData) {
        if (data.app.id === appId) {
          return data
        }
      }
      return null
    },
    checkVersions () {
      $('#btn_platform_upgrade').button('reset')
      $('#btn_installer_upgrade').button('reset')

      const btn = $('#btn_check_updates')
      btn.button('loading')
      const that = this
      axios.get('/rest/settings/versions')
        .then((resp) => {
          const platformData = this.findApp(resp.data.data, 'platform')
          this.platformVersion = platformData.installed_version
          this.platformVersionAvailable = platformData.current_version
          const installerData = this.findApp(resp.data.data, 'installer')
          this.installerVersion = installerData.installed_version
          this.installerVersionAvailable = installerData.current_version
          btn.button('reset')
          this.progress = false
        })
        .catch(err => {
          that.$refs.error.show(err)
          btn.button('reset')
          this.progress = false
        })
    }
  }
}
</script>
<style>
@import '../style/site.css';
@import '../style/material-icons.css';
</style>
