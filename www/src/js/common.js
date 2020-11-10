export function checkForServiceError(data, on_complete, on_error) {

    if (data.hasOwnProperty('success') && !data.success) {
        var xhr = {
            status: 200,
            responseJSON: data
        };
        on_error(xhr, {}, {});
    } else {
        on_complete();
    }

}

export const INSTALLER_STATUS_URL = '/rest/settings/installer_status';
export const DEFAULT_STATUS_PREDICATE = (response) => {
    return response.is_running;
};

export const JOB_STATUS_URL = '/rest/job/status';
export const JOB_STATUS_PREDICATE = (response) => {
    return response.data != 'JobStatusIdle';
};

export function runAfterJobIsComplete(timeout_func, on_complete, on_error, status_url, status_predicate) {

    var recheck_function = function () { runAfterJobIsComplete(timeout_func, on_complete, on_error, status_url, status_predicate); };

    var recheck_timeout = 2000;
    $.getJSON(status_url)
     .done(function(resp) {
            //alert('check status result');
            if (status_predicate(resp)) {
                timeout_func(recheck_function, recheck_timeout);
            } else
                on_complete();
        })
     .fail(function(xhr, textStatus, errorThrown) {
            //Auth error means job is finished
            if (xhr.status == 401) {
                on_error(xhr, textStatus, errorThrown)
            } else {
                timeout_func(recheck_function, recheck_timeout);
            }
        });

}

export function findApp(apps_data, app_id) {
    for (var app_data of apps_data) {
        if (app_data.app.id == app_id) {
            return app_data;
        }
    }
    return null;
}

export function getValue(values, name) {
    for (var value of values) {
        if (value.name === name) {
            return value.value;
        }
    }
    return null;
}

export function sendLogs(include_support, on_always, on_error) {
    $.get('/rest/send_log',
      { include_support: include_support }
    ).always(on_always).fail(on_error);
}

export function sendLog(on_always, on_error) {
    $.get('/rest/send_log').always(on_always).fail(on_error);
}
