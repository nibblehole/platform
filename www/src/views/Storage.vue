<template>
  <div class="wrapper">
    <div class="content">
      <div class="block1 wd12" id="block1">
        <h1>Storage</h1>

        <div class="row-no-gutters settingsblock">

          <div class="col2">
            <div class="setline">
              <div class="setline" style="margin-top: 20px;">
                <span class="span" style="font-weight: bold;">Boot disk</span>
              </div>

              <div class="setline">
                <div id="block_boot_disk" v-if="boot !== undefined">
                  <span class="span">Partition - {{ boot.size }}</span>
                  <div class="spandiv" v-if="boot.extendable">
                    <button class="buttongreen bwidth smbutton btn-lg"
                            id="btn_boot_extend"
                            data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Extending...">Extend
                    </button>
                  </div>
                </div>
              </div>

              <div class="setline" style="margin-top: 20px;">
                <span class="span" style="font-weight: bold;">External disks</span>
                <button data-toggle="modal" data-target="#help_external_disk" type=button
                        class="control" style=" background:transparent;">
                  <i class='fa fa-question-circle fa-lg'></i>
                </button>
              </div>

              <div id="block_disks">
                <span class="span" v-if="disks === undefined || disks.length === 0">No external disks found</span>
                <div v-for="(disk, index) in disks" :key="index">
                  <div class="setline" style="margin-top: 20px;">
                    <span class="span" style="font-weight: bold;" :id="'disk_name_' + index">
                      {{ disk.name }} - {{ disk.size }}
                    </span>
                    <div class="spandiv" v-if="!disk.active">
                      <button class="buttonred bwidth smbutton btn-lg"
                              data-type="format"
                              data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> "
                              @click="diskFormatConfirm(index, disk.device, disk.name)">Format
                      </button>
                    </div>
                  </div>
                  <div v-for="(partition, pindex) in disk.partitions" :key="pindex">
                    <div class="setline" v-if="partition.mountable || partition.active">
                      <span class="span" :id="'partition_name_' + index + '_' + pindex">
                        Partition - {{ partition.size }}
                      </span>
                      <div class="spandiv">
                        <Switch :checked="partition.active"
                                @toggle="diskActionConfirm(disk.name, partition)"
                                :progress="partition.progress"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  <Error ref="error"/>

  <Confirmation ref="partition_confirmation" @confirm="diskAction" @cancel="uiCheckDisks">
    <template v-slot:title>Partition action</template>
    <template v-slot:text>
      Your existing data will not be touched or moved<br>
      <span style="font-weight: bold;">{{ partitionActionDiskName }}</span><br>
      <span>{{ partitionActionName }}</span>
      <br>
      Are you sure?
    </template>
  </Confirmation>

  <div id="disk_format_confirmation" class="modal fade bs-are-use-sure" tabindex="-1" role="dialog"
       aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Disk format</h4>
        </div>
        <div class="modal-body">
          <!--          <input type="hidden" id="disk_index" value=""/>-->
          <div class="bodymod">
            <div class="btext">
              This will destroy all the data on this disk!<br>
              <span id="disk_name" style="font-weight: bold;">{{ deviceToFormatName }}</span><br>
              Are you sure?
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn buttonlight bwidth smbutton" data-dismiss="modal">Close
            </button>
            <button type="button" id="btn_disk_format" class="btn buttonlight bwidth smbutton" @click="diskFormat"
                    data-dismiss="modal">Format
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="help_external_disk" class="modal fade bs-are-use-sure" tabindex="-1" role="dialog"
       aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">External disk</h4>
        </div>
        <div class="modal-body">
          <div class="bodymod">
            <div class="btext">
              Every app is configured to use storage provided by the system (which is available at /data).
              This setting screen allows you to choose which attached disk to use for that storage.<br>
              Currently you can activate only one storage at a time.
              When activating a disk partition existing data will not be copied to the selected disk.<br><br>
              You can initialize a disk by formatting it to clear all the data or to make it compatible with the system.
            </div>

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
import 'bootstrap'
import 'bootstrap-switch'
import Error from '@/components/Error'
import Switch from '@/components/Switch'
import * as Common from '../js/common.js'
import Confirmation from '@/components/Confirmation'

export default {
  name: 'Storage',
  components: {
    Confirmation,
    Error,
    Switch
  },
  props: {
    onLogin: Function,
    onLogout: Function
  },
  data () {
    return {
      boot: undefined,
      disks: undefined,
      deviceToFormat: undefined,
      deviceToFormatIndex: undefined,
      deviceToFormatName: undefined,
      partitionActionDiskName: undefined,
      partitionActionName: undefined,
      partitionActionDevice: undefined,
      partitionAction: undefined
    }
  },
  mounted () {
    this.uiCheckDisks()
    this.updateBootDisk(this.uiDisplayBootDisk, (e, a, b) => this.$refs.error.show(e))
  },
  methods: {
    diskFormatConfirm (index, device, name) {
      this.deviceToFormatIndex = index
      this.deviceToFormat = device
      this.deviceToFormatName = name
      // console.log(this.deviceToFormatName)
      var btn = $('#btn_format_' + this.deviceToFormatIndex)
      btn.button('reset')
      $('#disk_format_confirmation').modal('show')
    },
    diskFormat () {
      const that = this
      // var index = $('#disk_index').val()
      var btn = $('#btn_format_' + this.deviceToFormatIndex)
      btn.button('loading')
      this.uiEnableControls(false)

      // var device = btn.data('device')

      const onError = (err, b, c) => {
        that.$refs.error.show(err)
        btn.button('reset')
      }

      $.post('/rest/storage/disk_format', { device: this.deviceToFormat })
        .done(function (data) {
          Common.checkForServiceError(data, function () {
            Common.runAfterJobIsComplete(
              setTimeout,
              that.uiCheckDisks,
              onError,
              Common.JOB_STATUS_URL,
              Common.JOB_STATUS_PREDICATE)
          }, onError)
        })
        .fail(onError)
    },
    uiBootExtend () {
      const that = this
      var btn = $('#btn_boot_extend')
      btn.button('loading')
      $.post('/rest/storage/boot_extend')
        .done(function (data) {
          Common.checkForServiceError(data, function () {
            Common.runAfterJobIsComplete(
              setTimeout,
              () => {
                that.updateBootDisk(
                  that.uiDisplayBootDisk,
                  function (err, b, c) {
                    that.$refs.error.show(err)
                    btn.button('reset')
                  })
              },
              function (err, b, c) {
                that.$refs.error.show(err)
                btn.button('reset')
              },
              Common.JOB_STATUS_URL,
              Common.JOB_STATUS_PREDICATE)
          }, function (err, b, c) {
            that.$refs.error.show(err)
            btn.button('reset')
          })
        })
        .fail(function (err, b, c) {
          that.$refs.error.show(err)
          btn.button('reset')
        })
    },
    uiDisplayBootDisk (data) {
      const that = this
      this.boot = data.data
      var btn = $('#btn_boot_extend')
      btn.button('reset')
      btn.off('click').on('click', function () {
        that.uiBootExtend()
      })
    },
    updateBootDisk (onComplete, onError) {
      $.get('/rest/settings/boot_disk').done(onComplete).fail(onError)
    },
    uiEnableControls (enabled) {
      $('[type=\'checkbox\']').each(function () {
        $(this).bootstrapSwitch('disabled', !enabled)
      })

      $('[data-type=\'format\']').each(function () {
        $(this).prop('disabled', !enabled)
      })
    },
    uiCheckDisks () {
      console.log('reload')
      $.get('/rest/settings/disks')
        .done(resp => {
          this.disks = resp.disks
          // console.log(this.disks)
          this.uiDisplayDisks()
        })
        .fail(err => this.$refs.error.show(err))
    },
    uiDisplayDisks () {
      // console.log(this)
      // $('[type=\'checkbox\']').each(function () {
      //   console.log(this)
      //   $(this).bootstrapSwitch()
      // })
      this.uiEnableControls(true)
      this.setupControls()
    },
    diskActionConfirm (diskName, partition) {
      this.partitionActionName = partition.name
      this.partitionActionDiskName = diskName
      this.partitionActionDevice = partition.device
      partition.active = !partition.active
      partition.progress = true
      this.partitionAction = partition.active
      this.$refs.partition_confirmation.show()
    },
    diskAction () {
      const that = this
      this.uiEnableControls(false)
      const mode = this.partitionAction ? 'disk_activate' : 'disk_deactivate'
      $.post('/rest/settings/' + mode, { device: this.partitionActionDevice })
        .done(function (data) {
          Common.checkForServiceError(
            data,
            function () {
            },
            (err) => that.$refs.error.show(err))
        })
        .always(this.uiCheckDisks)
        .fail((err) => that.$refs.error.show(err))
    },
    setupControls () {
      $('#partition_action_confirmation').on('hidden.bs.modal', function () {
        var state = $('#partition_state').val() === 'true'
        var tgl = $('#tgl_partition_' + $('#partition_id').val())
        tgl.bootstrapSwitch('state', !state, true)
      })

      $('#block_disks').find('[data-type=\'format\']').each(function () {
        var btn = $(this)
        btn.button('reset')
      })
    }
  }
}
</script>
<style>
@import '../style/site.css';
@import '../style/material-icons.css';
</style>
