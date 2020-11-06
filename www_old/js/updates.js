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

import * as Common from './common.js'

export function get_versions(on_complete, on_error) {
    $.get('/rest/settings/versions').done(on_complete).fail(on_error);
};

export function platform_upgrade(on_complete, on_error) {
    $.get('/rest/upgrade', { app_id: 'platform' })
        .done(function (data) {
                      Common.check_for_service_error(data, function () {
                          Common.run_after_job_is_complete(
                              setTimeout,
                              function () {
                                  get_versions(
                                       on_complete,
                                       on_error);
                               }, 
                               on_error,
                               Common.INSTALLER_STATUS_URL,
                               Common.DEFAULT_STATUS_PREDICATE);
                      }, on_error);
                  })
        .fail(on_error);

}

export function installer_upgrade(on_complete, on_error) {

    $.get('/rest/installer/upgrade')
        .done(function (data) {
                      Common.check_for_service_error(data, function () {
                          Common.run_after_job_is_complete(
                              setTimeout,
                              function () {
                                  get_versions(
                                      on_complete,
                                      on_error);
                              },
                              on_error,
                              Common.JOB_STATUS_URL,
                              Common.JOB_STATUS_PREDICATE);
                      }, on_error);
                  })
        .fail(on_error);

}

function ui_display_toggles() {
	$("[type='checkbox']").each(function() {
		$(this).bootstrapSwitch();
	});
}


function upgrade_buttons_enabled(is_enabled) {
		var btn_platform = $("#btn_platform_upgrade");
		var btn_installer = $("#btn_installer_upgrade");
		btn_platform.prop('disabled', !is_enabled);
		btn_installer.prop('disabled', !is_enabled);
}

function ui_display_versions(data) {

		var platform_data = Common.find_app(data.data, "platform");
		var installer_data = Common.find_app(data.data, "installer");

		$("#txt_platform_version").html(platform_data.installed_version);
		$("#txt_system_version_available").html(platform_data.current_version);

		if (platform_data.installed_version != platform_data.current_version) {
				$("#block_system_upgrade").show();
		} else {
				$("#block_system_upgrade").hide();
		}

		$("#txt_installer_version").html(installer_data.installed_version);
		$("#txt_installer_version_available").html(installer_data.current_version);

		if (installer_data.installed_version && installer_data.current_version && installer_data.installed_version != installer_data.current_version) {
				$("#block_installer_upgrade").show();
		} else {
				$("#block_installer_upgrade").hide();
		}
}

function ui_get_versions(on_always) {
		get_versions(ui_display_versions, on_always, UiCommon.ui_display_error);
}

function ui_check_versions() {
    var btn = $("#btn_check_updates");
    upgrade_buttons_enabled(false);
    btn.button('loading');
    
    get_versions(
        function (data) {
            ui_display_versions(data);
            btn.button('reset');
            upgrade_buttons_enabled(true);
        }, 
        function (a, b, c) {
            UiCommon.ui_display_error(a, b, c);
            btn.button('reset');
            upgrade_buttons_enabled(true);
        });
}

function ui_platform_upgrade() {
    var btn = $("#btn_platform_upgrade");
    btn.button('loading');

    platform_upgrade(
        function (data) {
            ui_display_versions(data);
            btn.button('reset');
        }, 
        function (a, b, c) {
            UiCommon.ui_display_error(a, b, c);
            btn.button('reset');
        });
 
}

function ui_installer_upgrade() {
    var btn = $("#btn_installer_upgrade");
    btn.button('loading');

    installer_upgrade(
        function (data) {
            ui_display_versions(data);
            btn.button('reset');
        },
        function (a, b, c) {
            UiCommon.ui_display_error(a, b, c);
            btn.button('reset');
        });
 
}

$(document).ready(function () {
    if (typeof mock !== 'undefined') { console.log("backend mock") };
    UiCommon.check_activation_status();
    ui_display_toggles();

    $("#btn_check_updates").on('click', function () {
    		ui_check_versions();
    });

    $("#btn_platform_upgrade").on('click', function () {
    		ui_platform_upgrade();
    });

    $("#btn_installer_upgrade").on('click', function () {
    		ui_installer_upgrade();
    });

    ui_check_versions();
});
