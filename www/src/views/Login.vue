<template>

  <div class="wrapper">
    <div class="content">
      <!--Login_block1-->
      <div class="block1 wd12" id="block1">
        <h1>Log in</h1>
        <div class="formblock">
          <form id="form-login" @submit="login">
            <input placeholder="Login" class="nameinput" id="name" type="text" v-model="username">
            <input placeholder="Password" class="passinput" id="password" type="password" v-model="password">
            <button class="submit buttongreen control" id="btn_login" type="submit"
                    data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Logging in...">Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

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
            <button id="btn_error_send_logs" type="button" class="btn buttonblue bwidth smbutton">Send logs</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as UiCommon from '../js/ui/common.js'
// import './ui/menu.js'
// import Common from './common.js'
import $ from 'jquery'
import querystring from 'querystring'

export default {
  name: 'Login',
  props: {
    onLogin: Function
  },
  data () {
    return {
      username: String,
      password: String,
      loading: Boolean
    }
  },
  mounted () {
    this.loading = false
    this.username = ''
    this.password = ''
  },
  methods: {
    login: function (event) {
      event.preventDefault()
      var btn = $('#btn_login')
      btn.button('loading')
      $('#form-login input').prop('disabled', true)
      UiCommon.hideFieldsErrors('form-login')
      $.post('/rest/login', querystring.stringify({ name: this.username, password: this.password }))
        .done((data) => {
          this.onLogin()
          this.$router.push('/')
        })
        .fail((xhr, textStatus, errorThrown) => UiCommon.uiDisplayError(xhr, this.$router))
        .always(() => {
          btn.button('reset')
          $('#form-login input').prop('disabled', false)
        })
    }
  }
}
</script>
<style>
@import '../style/site.css';
@import '../style/material-icons.css';
</style>
