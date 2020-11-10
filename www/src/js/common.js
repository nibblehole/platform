import $ from 'jquery'

export function checkForServiceError (data, onComplete, onError) {
  if ('success' in data && !data.success) {
    var xhr = {
      status: 200,
      responseJSON: data
    }
    onError(xhr, {}, {})
  } else {
    onComplete()
  }
}

export const INSTALLER_STATUS_URL = '/rest/settings/installer_status'
export const DEFAULT_STATUS_PREDICATE = (response) => {
  return response.is_running
}

export const JOB_STATUS_URL = '/rest/job/status'
export const JOB_STATUS_PREDICATE = (response) => {
  return response.data !== 'JobStatusIdle'
}

export function runAfterJobIsComplete (timeoutFunc, onComplete, onError, statusUrl, statusPredicate) {
  const recheckFunc = function () {
    runAfterJobIsComplete(timeoutFunc, onComplete, onError, statusUrl, statusPredicate)
  }

  const recheckTimeout = 2000
  $.getJSON(statusUrl)
    .done(function (resp) {
      if (statusPredicate(resp)) {
        timeoutFunc(recheckFunc, recheckTimeout)
      } else {
        onComplete()
      }
    })
    .fail(function (xhr, textStatus, errorThrown) {
      // Auth error means job is finished
      if (xhr.status === 401) {
        onError(xhr, textStatus, errorThrown)
      } else {
        timeoutFunc(recheckFunc, recheckTimeout)
      }
    })
}

export function findApp (appsData, appId) {
  for (var appData of appsData) {
    if (appData.app.id === appId) {
      return appData
    }
  }
  return null
}

export function getValue (values, name) {
  for (var value of values) {
    if (value.name === name) {
      return value.value
    }
  }
  return null
}

export function sendLogs (includeSupport, onAlways, onError) {
  $.get('/rest/send_log',
    { include_support: includeSupport }
  ).always(onAlways).fail(onError)
}

export function sendLog (onAlways, onError) {
  $.get('/rest/send_log').always(onAlways).fail(onError)
}
