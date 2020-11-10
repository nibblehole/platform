<template>
  <div class="wrapper">
    <div class="content">
      <div class="block1 wd12" id="block_app">
        <div class="appblock" v-if="info !== undefined">
          <div>
            <div>
              <img :src="info.app.icon" class="appimg" alt="">
            </div>
            <div class="appinfo">
              <h1>{{ info.app.name }}</h1>
              <div v-if="info.installed_version !== null">
                <b>Installed version:</b> {{ info.installed_version }}<br>
              </div>
              <div v-if="info.installed_version !== info.current_version">
                <b>Available version:</b> {{ info.current_version }}<br>
              </div>
              <!--<b>Size:</b> 17.0 MB-->
            </div>
          </div>
          <div>
            <div class="buttonblock">
                <button id="btn_open" :data-url="info.app.url" class="buttonblue bwidth smbutton" @click="open"
                        v-if="info.installed_version !== null">
                  Open
                </button>
                <button id="btn_install" class="buttonblue bwidth smbutton"
                        data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Installing..." @click="install"
                        v-if="info.installed_version === null">
                  Install
                </button>
                <button id="btn_upgrade" class="buttongreen bwidth smbutton"
                        data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Upgrading..." @click="upgrade"
                        v-if="info.installed_version !== null && info.installed_version !== info.current_version">
                  Upgrade
                </button>
                <button id="btn_remove" class="buttongrey bwidth smbutton"
                        data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Removing..."
                        v-if="info.installed_version !== null">
                  Remove
                </button>
                <button id="btn_backup" class="buttonblue bwidth smbutton"
                        data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Creating backup..."
                        @click="$('#backup_confirmation').modal('show')"
                        v-if="info.installed_version !== null">
                  Backup
                </button>
            </div>
            <div class="btext">{{ info.app.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Error/>

  <div id="app_action_confirmation" class="modal fade bs-are-use-sure" tabindex="-1" role="dialog"
       aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title"><span id="confirm_caption">{{ action }}</span></h4>
        </div>
        <div class="modal-body">
          <div class="bodymod">
            <div class="btext">
              Are you sure?
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn buttonlight bwidth smbutton" data-dismiss="modal">Close
            </button>
            <button type="button" id="btn_confirm" class="btn buttonlight bwidth smbutton"
                    data-dismiss="modal" @click="confirm">OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="backup_confirmation" class="modal fade bs-are-use-sure" tabindex="-1" role="dialog"
       aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Backup</h4>
        </div>
        <div class="modal-body">
          <div class="bodymod">
            <div class="btext">
              This will backup app settings excluding files uploaded to the disk storage.<br>
              Later you can restore it from Settings - Backup<br>
              Are you sure?
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn buttonlight bwidth smbutton" data-dismiss="modal">Close
            </button>
            <button type="button" id="btn_backup_confirm" class="btn buttonlight bwidth smbutton"
                    data-dismiss="modal" @click="backup">OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as UiCommon from '../js/ui/common.js'
import $ from 'jquery'
import Error from '@/components/Error'
import 'bootstrap'
import 'bootstrap-switch'
import * as Common from '../js/common.js'

export default {
  name: 'App',
  data () {
    return {
      info: undefined,
      appId: undefined,
      action: ''
    }
  },
  components: {
    Error
  },
  mounted () {
    this.appId = this.$route.query.id
    this.uiLoadApp()
  },
  methods: {
    uiLoadApp: function () {
      $.get('/rest/app', { app_id: this.appId })
        .done(data => {
          this.info = data.info
        })
        .fail(UiCommon.uiDisplayError)
    },
    open: function (event) {
      window.location.href = this.info.app.url
    },
    install: function (event) {
      this.action = 'Install'
      this.actionUrl = '/rest/install'
      $('#app_action_confirmation').modal('show')
    },
    upgrade: function (event) {
      this.action = 'Upgrade'
      this.actionUrl = '/rest/upgrade'
      $('#app_action_confirmation').modal('show')
    },
    remove: function (event) {
      this.action = 'Remove'
      this.actionUrl = '/rest/remove'
      $('#app_action_confirmation').modal('show')
    },
    backup: function () {
      const btn = $('#btn_backup')
      btn.button('loading')

      $.get('/rest/backup/create', { app: this.appId })
        .always((data) => {
          Common.checkForServiceError(data, () => {
            Common.runAfterJobIsComplete(
              setTimeout,
              () => {
                btn.button('reset')
                this.uiLoadApp()
              },
              UiCommon.uiDisplayError,
              Common.JOB_STATUS_URL,
              Common.JOB_STATUS_PREDICATE)
          }, UiCommon.uiDisplayError)
        })
        .fail(UiCommon.uiDisplayError)
    },
    confirm: function () {
      const btn = $('#btn_' + this.action.toLowerCase())
      btn.button('loading')

      $.get(this.actionUrl, { app_id: this.appId })
        .always((data) => {
          Common.checkForServiceError(data, () => {
            Common.runAfterJobIsComplete(
              setTimeout,
              () => {
                btn.button('reset')
                this.uiLoadApp()
              },
              UiCommon.uiDisplayError,
              Common.INSTALLER_STATUS_URL,
              Common.DEFAULT_STATUS_PREDICATE)
          }, UiCommon.uiDisplayError)
        })
        .fail(UiCommon.uiDisplayError)
    }
  }
}
</script>
<style>
@import '../style/site.css';
@import '../style/material-icons.css';
</style>
