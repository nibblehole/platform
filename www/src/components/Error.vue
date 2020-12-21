<template>
  <div :id="'block_' + name" class="modal fade bs-are-use-sure" tabindex="-1" role="dialog"
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
            <div :id="'txt_' + name" class="btext">Some error happened!</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn buttonlight bwidth smbutton" data-dismiss="modal">Close</button>
            <button
              v-if="enableLogs"
              id="btn_error_send_logs"
              type="button"
              @click="sendLogs"
              class="btn buttonblue bwidth smbutton">Send logs
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <input id="test_parameter1" v-if="testing" />
</template>
<script>
import $ from 'jquery'
import toastr from 'toastr'
import axios from 'axios'

function showFieldError (field, error) {
  const txtFieldSelector = '#' + field
  const errorBlockId = getErrorBlockId(field)
  const errorBlockSelector = '#' + errorBlockId
  const errorHtml = '<div class=\'alert alert-danger alert90\' id=\'' + errorBlockId + '\'><b>' + error + '</b></div>'
  console.log(txtFieldSelector)
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
  props: {
    name: { type: String, default: 'error' },
    enableLogs: { type: Boolean, default: true },
    testing: { type: Boolean, default: false }
  },
  methods: {
    sendLogs () {
      axios
        .post('/rest/send_log', null, { params: { include_support: true } })
        .catch(err => {
          console.log(err)
        })
    },
    showAxios (error) {
      this.show({
        status: error.response.status,
        responseJSON: error.response.data
      })
    },
    show (xhr) {
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
        const messageField = '#txt_' + this.name
        const dialog = '#block_' + this.name
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
            $(messageField).text(error.message)
            $(dialog).modal()
          }
        } else {
          $(messageField).text('Server Error')
          $(dialog).modal()
        }
      }
    },
    showToast (error) {
      const status = error.response.status
      if (status === 401) {
        this.$router.push('/login')
      } else if (status === 0) {
        console.log('user navigated away from the page')
      } else {
        let message = 'Server Error'
        if ('data' in error.response && 'message' in error.response.data) {
          message = error.response.data.message
        }
        toastr.error(message)
      }
    }
  }
}
</script>
