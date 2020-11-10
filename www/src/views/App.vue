<template>
  <div class="wrapper">
    <div class="content">
      <div class="block1 wd12" id="block_app">
        <div class="appblock">
          <div>
            <div>
              <img src="<%= info.app.icon %>" class="appimg" alt="">
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
              <div v-if="info.installed_version !== null">
                <button id="btn_open" :data-url="info.app.url" class="buttonblue bwidth smbutton">Open</button>
              </div>
              <div v-if="info.installed_version === null">
                <button id="btn_install" class="buttonblue bwidth smbutton"
                        data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Installing...">Install
                </button>
              </div>
              <div v-if="info.installed_version !== null && info.installed_version !== info.current_version">
              <button id="btn_upgrade" class="buttongreen bwidth smbutton"
                      data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Upgrading...">Upgrade
              </button>
              </div>
              <div v-if="info.installed_version !== null">
              <button id="btn_remove" class="buttongrey bwidth smbutton"
                      data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Removing...">Remove
              </button>
              </div>
              <div v-if="info.installed_version !== null">
              <button id="btn_backup" class="buttonblue bwidth smbutton"
                      data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Creating backup...">Backup
              </button>
              </div>
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
          <h4 class="modal-title"><span id="confirm_caption"></span></h4>
        </div>
        <div class="modal-body">
          <input type="hidden" id="app_id" value=""/>
          <input type="hidden" id="app_action" value=""/>
          <input type="hidden" id="app_action_url" value=""/>
          <input type="hidden" id="app_action_status_url" value=""/>
          <div class="bodymod">
            <div class="btext">
              Are you sure?
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn buttonlight bwidth smbutton" data-dismiss="modal">Close
            </button>
            <button type="button" id="btn_confirm" class="btn buttonlight bwidth smbutton"
                    data-dismiss="modal">OK
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
                    data-dismiss="modal">OK
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
import Error from "@/components/Error";
// import URI from "urijs";

import 'bootstrap';
import 'bootstrap-switch';
// import './ui/menu.js'

import * as Common from '../js/common.js'

function loadApp(app_id, on_complete, on_error) {
  $.get('/rest/app', {app_id: app_id}).done(on_complete).fail(on_error);
};

export function run_app_action(url, app_id, status_url, status_predicate, on_complete, on_error) {
  $.get(url, {app_id: app_id})
    .always((data) => {
      Common.checkForServiceError(data, () => {
        Common.runAfterJobIsComplete(
          setTimeout,
          on_complete,
          on_error,
          status_url,
          status_predicate);
      }, on_error)
    })
    .fail(on_error);
}

function register_btn_open_click() {
  $("#btn_open").off('click').on('click', function () {
    var btn = $(this);
    var app_url = btn.data('url');
    window.location.href = app_url;
  });
}

function register_btn_action_click(name, url) {
  const action = name.toLowerCase();

  $("#btn_" + action).off('click').on('click', function () {
    $('#app_action').val(action);
    $('#app_action_url').val(url);
    $('#confirm_caption').html(name);
    $('#app_action_confirmation').modal('show');
  });
}

function uiDisplayApp(data) {
  // $("#block_app").html(_.template(AppTemplate)(data));
  this.info = data
  const app_id = data.info.app.id;
  register_btn_open_click();
  register_btn_action_click('Install', '/rest/install');
  register_btn_action_click('Upgrade', '/rest/upgrade');
  register_btn_action_click('Remove', '/rest/remove');

  $("#btn_backup").off('click').on('click', function () {
    $('#backup_confirmation').modal('show');
  });

  $("#btn_backup_confirm").off('click').on('click', function () {
    var btn = $("#btn_backup");
    btn.button('loading');

    $.get('/rest/backup/create', {app: app_id})
      .always((data) => {
        Common.checkForServiceError(data, () => {
          Common.runAfterJobIsComplete(
            setTimeout,
            () => {
              btn.button('reset');
              ui_load_app();
            },
            UiCommon.ui_display_error,
            Common.JOB_STATUS_URL,
            Common.JOB_STATUS_PREDICATE);
        }, UiCommon.ui_display_error)
      })
      .fail(UiCommon.ui_display_error);
  });

  $("#btn_confirm").off('click').on('click', function () {
    var btn = $("#btn_" + $('#app_action').val());
    btn.button('loading');

    run_app_action(
      $('#app_action_url').val(),
      app_id,
      Common.INSTALLER_STATUS_URL,
      Common.DEFAULT_STATUS_PREDICATE,
      () => {
        btn.button('reset');
        ui_load_app();
      },
      UiCommon.ui_display_error);
  });
}

function ui_load_app() {
  const app_id = this.$route.query.id
  loadApp(app_id, uiDisplayApp, UiCommon.ui_display_error);
}

export default {
  name: 'App',
  data() {
    return {
      info: undefined
    }
  },
  components: {
    Error
  },
  mounted() {
    ui_load_app();
  }
}
</script>
<style>
@import '../style/site.css';
@import '../style/material-icons.css';
</style>
