<template>
  <div class="wrapper">
    <div class="content">
      <div class="block1 wd12" id="block1">
        <h1>Access</h1>
        <div class="row-no-gutters settingsblock">
          <div class="col2">
            <h3>Domain name</h3>
            <div class="setline">
              <span class="span">External Access:
                <div class="spandiv" id="external_mode">
                  <input type="checkbox" id="tgl_external" data-on-text="ON" data-off-text="OFF" data-label-width="8"
                  />
                  <i class="fa fa-circle-o-notch fa-spin switchloading opacity-invisible" id="tgl_external_loading"
                      style="padding: 0 0 0 5px" ></i>
                </div>

                <button type=button @click="showExternalAccessInfo" class="control" style=" background:transparent;">
                          <i class='fa fa-question-circle fa-lg'></i>
                        </button>
              </span>
            </div>
            <div id="external_block" style="display: none">
              <div class="setline">
                <span class="span">Auto detect IP:
                  <div class="spandiv" id="ip_autodetect">
                    <input type="checkbox" id="tgl_ip_autodetect" data-on-text="ON" data-off-text="OFF"
                           data-label-width="8" />
                    <i class="fa fa-circle-o-notch fa-spin switchloading opacity-invisible"
                        style="padding: 0 0 0 5px" id="tgl_ip_autodetect_loading"></i>
                  </div>
                </span>
              </div>

              <div class="setline">
                <span class="span">Public IP:</span>
                <input id="public_ip" type="text"
                       style="width: 150px; height: 30px; padding: 0 10px 0 10px">
              </div>

              <div class="setline">
                <h3>Router external ports</h3>
              </div>

              <div class="setline">
                <span class="span">Auto mode (UPnP):
                  <div class="spandiv">
                    <input type="checkbox" id="tgl_upnp" data-on-text="ON" data-off-text="OFF" data-label-width="8"/>
                    <i class="fa fa-circle-o-notch fa-spin switchloading opacity-invisible" id="tgl_upnp_loading"></i>
                    <button id="upnp_warning" type=button @click="showUpnpDisabledWarning"
                            class="control" style="background:transparent;">
                      <i class='fa fa-exclamation-circle fa-lg' style='color: red;'></i>
                    </button>
                  </div>
                </span>
              </div>

              <div class="setline">
                  <span class="span">External certificate
                      <span style='white-space: nowrap;'> HTTP port 80:
                          <input id="certificate_port" type="text"
                                 style="width: 80px; height: 30px; padding: 0 10px 0 10px">
                          <button id="certificate_port_warning" type=button @click="showCertificatePortWarning"
                                  class="control" style="background:transparent;">
                              <i class='fa fa-exclamation-circle fa-lg' style='color: red;'></i>
                          </button>
                      </span>
                  </span>

              </div>

              <div class="setline">
                  <span class="span">External access
                      <span style='white-space: nowrap;'> HTTPS port 443:
                          <input id="access_port" type="text"
                                 style="width: 80px; height: 30px; padding: 0 10px 0 10px"/>
                          <button id="access_port_warning" type=button @click="showAccessPortWarning"
                                  class="control" style="background:transparent;">
                              <i class='fa fa-exclamation-circle fa-lg' style='color: red;'></i>
                          </button>
                      </span>
                  </span>
              </div>

            </div>

            <div class="setline">
              <div class="spandiv">
                <button class="submit buttongreen control" id="btn_save" type="submit"
                        data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Working..."
                        style="width: 150px" @click="save">Save
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>

  <Dialog ref="certificate_port_warning">
    <template v-slot:title>Certificate warning</template>
    <template v-slot:text>
      Certificate can only be obtained if external port is 80.
      It is only used for certificate validation purposes.
    </template>
  </Dialog>

  <Dialog ref="access_port_warning">
    <template v-slot:title>Access port warning</template>
    <template v-slot:text>
      Access port is not default 443.
      You may not be able to access your device from networks with strict firewalls allowing only port 443.
    </template>
  </Dialog>

  <Dialog ref="upnp_disabled_warning">
    <template v-slot:title>UPnP is not available</template>
    <template v-slot:text>Your router does not have port mapping feature enabled.</template>
  </Dialog>

  <Dialog ref="external_access_info">
    <template v-slot:title>External access</template>
    <template v-slot:text>
      External access is used for two things:
      <br><br>
      1. Allow syncloud.it device DNS to use public IP. By default it uses internal IP to allow DNS based app
      access inside local network.
      <br>
      2. Maintain UPnP (auto) port mappings.
      <br><br>
      External access will not change device itself ports, they are always 80 and 443.
      <br><br>
      Syncloud.it DNS service verifies open ports (internet accessibility) before enabling external access for
      convenience.
      <br><br>
      In case of custom domain name external access page should not be used.
    </template>
  </Dialog>

  <Error ref="error"/>

</template>

<script>
import $ from 'jquery'
import Error from '@/components/Error'
import Dialog from '@/components/Dialog'
import 'bootstrap'
import 'bootstrap-switch'
import * as Common from '../js/common.js'
import axios from 'axios'

function uiDisplayPortMappings (data) {
  // console.log('show ports: ')

  var certificatePortMapping = data.port_mappings.find(function (mapping) {
    return mapping.local_port === 80
  })
  var certificatePort = 0
  if (certificatePortMapping) {
    certificatePort = certificatePortMapping.external_port
  }
  $('#certificate_port').val(certificatePort)
  if (certificatePort !== 80) {
    $('#certificate_port_warning').show('slow')
  } else {
    $('#certificate_port_warning').hide('slow')
  }

  var accessPortMapping = data.port_mappings.find(function (mapping) {
    return mapping.local_port === 443
  })
  var accessPort = 0
  if (accessPortMapping) {
    accessPort = accessPortMapping.external_port
  }
  $('#access_port').val(accessPort)
  if (accessPort !== 443) {
    $('#access_port_warning').show('slow')
  } else {
    $('#access_port_warning').hide('slow')
  }
}

function uiDisplayAccess (data) {
  var accessData = data.data
  // console.log('show external access: ' + accessData.external_access)
  $('#tgl_external').bootstrapSwitch('disabled', false)
  $('#tgl_external').bootstrapSwitch('state', accessData.external_access, true)
  $('#tgl_external_loading').removeClass('opacity-visible')

  $('#tgl_ip_autodetect').bootstrapSwitch('disabled', false)

  $('#tgl_ip_autodetect_loading').removeClass('opacity-visible')
  let ipAutodetectEnabled
  if ('public_ip' in accessData) {
    ipAutodetectEnabled = false
    $('#public_ip').val(accessData.public_ip)
  } else {
    ipAutodetectEnabled = true
    $('#public_ip').val('')
  }

  $('#tgl_ip_autodetect').bootstrapSwitch('state', ipAutodetectEnabled)

  $('#tgl_upnp').bootstrapSwitch('disabled', false)
  $('#tgl_upnp').bootstrapSwitch('state', accessData.upnp_enabled)
  $('#tgl_upnp_loading').removeClass('opacity-visible')

  if (accessData.upnp_available) {
    $('#upnp_warning').hide('slow')
  } else {
    $('#upnp_warning').show('slow')
  }

  if (accessData.upnp_available) {
    $('#label_upnp').css('color', 'black')
  } else {
    $('#label_upnp').css('color', 'red')
  }

  $('#btn_save').button('reset')

  $('#tgl_external').bootstrapSwitch('disabled', false)
  $('#tgl_upnp').bootstrapSwitch('disabled', false)

  uiPrepareExternalAccess()
  uiPrepareAddress()
  uiUpnp()
}

function disableAccessControls (disabled) {
  $('#tgl_external').bootstrapSwitch('disabled', disabled)
  $('#tgl_ip_autodetect').bootstrapSwitch('disabled', disabled)
  $('#tgl_upnp').bootstrapSwitch('disabled', disabled)
  $('#public_ip').prop('disabled', disabled)
  $('#certificate_port').prop('disabled', disabled)
  $('#access_port').prop('disabled', disabled)
}

function uiPrepareExternalAccess () {
  var toggle = $('#tgl_external')
  var enabled = toggle.bootstrapSwitch('state')
  if (enabled) {
    $('#external_block').show('slow')
  } else {
    $('#external_block').hide('slow')
  }
}

function uiPrepareAddress () {
  var toggle = $('#tgl_ip_autodetect')
  var enabled = toggle.bootstrapSwitch('state')
  $('#public_ip').prop('disabled', enabled)
}

function uiUpnp () {
  var toggle = $('#tgl_upnp')
  var enabled = toggle.bootstrapSwitch('state')
  $('#certificate_port').prop('disabled', enabled)
  $('#access_port').prop('disabled', enabled)
}

function isValidPort (port) {
  return Number.isNaN(port) || port < 1 || port > 65535
}

function error (message) {
  return {
    status: 200,
    responseJSON: {
      message: message
    }
  }
}

export default {
  name: 'Access',
  props: {
    onLogin: Function,
    onLogout: Function
  },
  data () {
    return {
      interfaces: undefined
    }
  },
  components: {
    Error,
    Dialog
  },
  mounted () {
    $('[type=\'checkbox\']').each(function () {
      $(this).bootstrapSwitch()
    })

    $('#tgl_external').on('switchChange.bootstrapSwitch', function (event, state) {
      // console.log('change external access: ' + state)
      event.preventDefault()
      uiPrepareExternalAccess()
    })

    $('#tgl_ip_autodetect').on('switchChange.bootstrapSwitch', function (event, state) {
      event.preventDefault()
      uiPrepareAddress()
    })

    $('#tgl_upnp').on('switchChange.bootstrapSwitch', function (event, state) {
      event.preventDefault()
      uiUpnp()
    })

    this.uiCheckAccess()
  },
  methods: {
    showUpnpDisabledWarning () {
      this.$refs.upnp_disabled_warning.show()
    },
    showAccessPortWarning () {
      this.$refs.access_port_warning.show()
    },
    showCertificatePortWarning () {
      this.$refs.certificate_port_warning.show()
    },
    showExternalAccessInfo () {
      this.$refs.external_access_info.show()
    },
    uiCheckAccess () {
      const error = this.$refs.error
      disableAccessControls(true)

      $('#tgl_external_loading').addClass('opacity-visible')
      $('#tgl_upnp_loading').addClass('opacity-visible')
      $('#tgl_ip_autodetect_loading').addClass('opacity-visible')
      $('#btn_save').button('loading')

      axios.get('/rest/access/access')
        .then((data) => {
          Common.checkForServiceError(
            data,
            () => uiDisplayAccess(data.data),
            err => error.show(err))
        })
        .catch(err => error.showAxios(err))

      axios.get('/rest/access/port_mappings')
        .then(resp => uiDisplayPortMappings(resp.data))
        .catch(err => error.showAxios(err))
    },
    save (event) {
      event.preventDefault()
      const that = this
      const accessEnabled = $('#tgl_external').bootstrapSwitch('state')
      const requestData = {
        external_access: accessEnabled,
        upnp_enabled: false,
        certificate_port: 0,
        access_port: 0
      }
      // console.log('save external access: ' + accessEnabled)
      if (accessEnabled) {
        const upnpEnabled = $('#tgl_upnp').bootstrapSwitch('state')
        requestData.upnp_enabled = upnpEnabled
        if (!upnpEnabled) {
          const certificatePortString = $('#certificate_port').val()
          const certificatePort = parseInt(certificatePortString)
          const accessPortString = $('#access_port').val()
          const accessPort = parseInt(accessPortString)
          if (isValidPort(certificatePort)) {
            this.$refs.error.show(error('certificate port (' + certificatePortString + ') has to be between 1 and 65535'))
            return
          }
          requestData.certificate_port = certificatePort
          if (isValidPort(accessPort)) {
            this.$refs.error.show(error('access port (' + accessPortString + ') has to be between 1 and 65535'))
            return
          }
          requestData.access_port = accessPort
        }
        const ipAutoDetect = $('#tgl_ip_autodetect').bootstrapSwitch('state')
        const publicIp = $('#public_ip').val().trim()
        if (!ipAutoDetect) {
          requestData.public_ip = publicIp
        }
      }

      disableAccessControls(true)
      const btn = $('#btn_save')
      btn.button('loading')
      axios.post('/rest/access/set_access', requestData)
        .then(response => {
          Common.checkForServiceError(
            response.data,
            this.uiCheckAccess,
            function (xhr, textStatus, errorThrown) {
              that.$refs.error.show(xhr)
              that.uiCheckAccess()
            }
          )
        })
        .catch(err => {
          that.$refs.error.showAxios(err)
          this.uiCheckAccess()
        })
    }
  }
}
</script>
<style>
@import '../style/site.css';
@import '../style/material-icons.css';
</style>
