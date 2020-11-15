import toastr from 'toastr'

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
