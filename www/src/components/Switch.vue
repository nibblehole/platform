<template>
  <input ref="switch"
         type="checkbox"
         data-on-text="Active"
         data-off-text="Not active"
         data-label-width="8"
         @click="$emit('toggle')"
  />
  <i style="margin-left: 10px" class="fa fa-circle-o-notch fa-spin switchloading"
     :class="{ 'opacity-visible': showProgress, 'opacity-invisible': !showProgress }"></i>
</template>
<script>
import 'bootstrap'
import 'bootstrap-switch'
import $ from 'jquery'

export default {
  name: 'Switch',
  emits: ['toggle'],
  props: {
    checked: Boolean,
    progress: Boolean
  },
  watch: {
    checked (val) {
      this.init()
    },
    progress (val) {
      console.log('cahnge: ' + val)
      this.showProgress = !!val
      console.log(this.showProgress)
    }
  },
  data () {
    return {
      showProgress: false
    }
  },
  methods: {
    init () {
      const input = $(this.$refs.switch)
      input.off('switchChange.bootstrapSwitch')
      input.bootstrapSwitch('state', this.checked)
      const that = this
      input.on('switchChange.bootstrapSwitch', function (e, s) {
        that.$emit('toggle')
        that.showProgress = true
        console.log(that.showProgress)
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
