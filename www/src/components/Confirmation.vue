<template>
  <div ref="confirmation" id="partition_action_confirmation" class="modal fade bs-are-use-sure" tabindex="-1"
       role="dialog"
       aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content" v-click-outside="outside">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">
            <slot name="title"></slot>
          </h4>
        </div>
        <div class="modal-body">
          <div class="bodymod">
            <div class="btext">
              <slot name="text"></slot>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" id="btn_partition_cancel" class="btn buttonlight bwidth smbutton"
                    data-dismiss="modal" @click="$emit('cancel')">Close
            </button>
            <button type="button" id="btn_partition_action" class="btn buttonlight bwidth smbutton"
                    data-dismiss="modal" @click="$emit('confirm')">Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import 'bootstrap'
import $ from 'jquery'

export default {
  name: 'Confirmation',
  emits: ['confirm', 'cancel'],
  methods: {
    show () {
      $(this.$refs.confirmation).modal('show')
    },
    outside () {
      this.$emit('cancel')
    }
  }
}
</script>
