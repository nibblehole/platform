import toastr from 'toastr'
import $ from 'jquery'

function getErrorBlockId (field) {
  return field + '_alert'
}

function showFieldError (field, error) {
  var txtFieldSelector = '#' + field
  var errorBlockId = getErrorBlockId(field)
  var errorBlockSelector = '#' + errorBlockId
  var errorHtml = '<div class=\'alert alert-danger alert90\' id=\'' + errorBlockId + '\'><b>' + error + '</b></div>'
  $(errorHtml).insertAfter(txtFieldSelector)
  $(txtFieldSelector).bind('keyup change', function () {
    $(errorBlockSelector).remove()
  })
}

// function hide_field_error(txt_field) {
//     var error_block_id = error_block_id(txt_field);
//     var error_block_selector = "#"+error_block_id;
//     $( error_block_selector ).remove();
// }

export function hideFieldsErrors (form) {
  $('#' + form + ' .alert').remove()
}

export function checkActivationStatus () {
  $.get('/rest/activation_status').done(function (data) {
    if (!data.activated) {
      window.location.href = 'activate.html'
    }
  })
}

export function checkDeactivationStatus () {
  $.get('/rest/activation_status').done(function (data) {
    if (data.activated) {
      window.location.href = 'login.html'
    }
  })
}

export function uiDisplayError (xhr, router) {
  var status = xhr.status
  var error = null
  if ('responseJSON' in xhr) {
    error = xhr.responseJSON
  }

  if (status === 401) {
    router.push('/login')
  } else if (status === 0) {
    console.log('user navigated away from the page')
  } else {
    if (error) {
      if ('parameters_messages' in error) {
        for (var i = 0; i < error.parameters_messages.length; i++) {
          var pm = error.parameters_messages[i]
          var messageText = pm.messages.join('\n')
          showFieldError(pm.parameter, messageText)
        }
      } else {
        if (!('message' in error && error.message)) {
          error.message = 'Server Error'
        }
        $('#txt_error').text(error.message)
        $('#block_error').modal()
      }
    } else {
      window.location.href = 'error.html'
    }
  }
}

export function uiDisplayErrorToast (xhr, textStatus, errorThrown) {
  var status = xhr.status
  var error = null
  if ('responseJSON' in xhr) {
    error = xhr.responseJSON
  }

  if (status === 401) {
    window.location.href = 'login.html'
  } else if (status === 0) {
    console.log('user navigated away from the page')
  } else {
    if (error) {
      var message = 'Server Error'
      if ('message' in error && error.message) {
        message = error.message
      }
      toastr.error(message)
    } else {
      window.location.href = 'error.html'
    }
  }
}
