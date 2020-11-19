<template>
  <div id="block_error" class="modal fade bs-are-use-sure" tabindex="-1" role="dialog"
       aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Error</h4>
        </div>
        <div class="modal-body">
          <div class="bodymod">
            <div id="txt_error" class="btext">Some error happened!</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn buttonlight bwidth smbutton" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import toastr from 'toastr'

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

function getErrorBlockId (field) {
  return field + '_alert'
}

export default {
  name: 'Error',
  methods: {
    showAxios (error) {
      this.show({
        status: error.response.status,
        responseJSON: error.response.data
      })
    },
    show (xhr) {
      console.log('error')
      const status = xhr.status
      let error = null
      if ('responseJSON' in xhr) {
        error = xhr.responseJSON
      }

      if (status === 401) {
        this.$router.push('/login')
      } else if (status === 0) {
        console.log('user navigated away from the page')
      } else {
        if (error) {
          if ('parameters_messages' in error) {
            for (let i = 0; i < error.parameters_messages.length; i++) {
              const pm = error.parameters_messages[i]
              const messageText = pm.messages.join('\n')
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
          this.$router.push('/error')
        }
      }
    },
    showToast (error) {
      const status = error.response.status
      let message = null
      if ('data' in error.response && error.response.data !== undefined) {
        message = error.response.data
      }

      if (status === 401) {
        this.$router.push('/login')
      } else if (status === 0) {
        console.log('user navigated away from the page')
      } else {
        if (message) {
          let message = 'Server Error'
          if ('message' in message && message.message) {
            message = message.message
          }
          toastr.error(message)
        } else {
          this.$router.push('/error')
        }
      }
    }
  }
}
</script>
