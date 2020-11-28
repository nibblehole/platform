<template>
  <div class="wrapper">
    <div class="content">
      <div class="block1 wd12" id="block1">
        <h1>Internal Memory</h1>

        <div class="row-no-gutters settingsblock">

          <div class="col2">
            <div class="setline">
              <div class="setline" style="margin-top: 20px;">
                <span class="span" style="font-weight: bold;">Boot</span>
              </div>

              <div class="setline">
                <div id="block_boot_disk" v-if="boot !== undefined">
                  <span class="span">Partition - {{ boot.size }}</span>
                  <div class="spandiv" v-if="boot.extendable">
                    <button class="buttongreen bwidth smbutton btn-lg"
                            @click="uiBootExtend"
                            id="btn_boot_extend"
                            data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Extending...">Extend
                    </button>
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

</template>

<script>
import $ from 'jquery'
import 'bootstrap'
import 'bootstrap-switch'
import Error from '@/components/Error'
import * as Common from '../js/common.js'

export default {
  name: 'InternalMemory',
  components: {
    Error
  },
  props: {
    onLogin: Function,
    onLogout: Function
  },
  data () {
    return {
      boot: undefined
    }
  },
  mounted () {
    this.uiDisplayBootDisk()
  },
  methods: {
    uiBootExtend () {
      const btn = $('#btn_boot_extend')
      btn.button('loading')
      const that = this
      const onError = (err, a, b) => {
        that.$refs.error.show(err)
        btn.button('reset')
      }
      $.post('/rest/storage/boot_extend')
        .done(data => {
          Common.checkForServiceError(
            data,
            () => {
              Common.runAfterJobIsComplete(
                setTimeout,
                that.uiDisplayBootDisk,
                onError,
                Common.JOB_STATUS_URL,
                Common.JOB_STATUS_PREDICATE)
            },
            onError)
        })
        .fail(onError)
    },
    uiDisplayBootDisk () {
      const that = this
      const btn = $('#btn_boot_extend')
      $.get('/rest/settings/boot_disk')
        .done(resp => {
          this.boot = resp.data
          btn.button('reset')
          // btn.off('click').on('click', function () {
          //   that.uiBootExtend()
          // })
        })
        .fail((err, a, b) => {
          that.$refs.error.show(err)
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
