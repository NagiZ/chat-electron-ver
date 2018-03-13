<template>
  <div class="login">
    <back></back>
    <menu-action></menu-action>
    <div class="logo">
      <img src="../assets/close.png" alt="Otaku Chat~" title="Otaku Chat~">
    </div>
    <div class="container-fluid row loginBox">
      <div id="login-form-box">
        <form method="formMds" id="login-form" class="lf">
          <div class="input-wrapper">
            <input type="text" v-model="phone" class="common-input" name="phone" placeholder="Phone Number" id="e-mail" title="Phone" @change="getPassword">
          </div>
          <div class="input-wrapper">
            <input type="password" v-model="password" class="common-input" name="password" placeholder="Password" id="password" title="Password">
          </div>
          <div class="form-gorup input-wrapper" id="captcha-box">
            <input type="text" class="common-input captcha-input" v-model="captcha" placeholder="Captcha">
          <!-- http://173.254.200.108:80/user/captcha -->
            <img id="captcha" src="http://173.254.200.108:80/user/captcha" title="看不清？换一张"  @click="getCaptcha">
          </div>
          <div class="btn-act">
            <button class="si" @click="sign($event)">Sign In</button>
            <a href="#"><span>Forget Password</span></a>
          </div>
        </form>
      </div>
    </div>
    <div class="haventset">
      <button class="si hsp" @click="cw">Haven't Set Password</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {ipcRenderer} from 'electron'
import storage from '../store/storage'
import menuAction from '@/components/Menu.vue'
import back from '@/components/Back.vue'
export default {
  name: 'Login',
  components: {menuAction, back},
  data () {
    return {
      password: '',
      phone: '',
      captcha: ''
    }
  },
  methods: {
    cw: function () {
      this.$store.state.ws = new WebSocket('ws://173.254.200.108:2333')
    },
    sign: async function (event) {
      if (this.captcha.trim() === '') {
        return false
      }
      var that = this
      event.preventDefault()
      var loginStatus = await that.$store.dispatch('sign', that)
      if (loginStatus.status === 200) {
        alert('Login successfully!')
        await that.$store.dispatch('autoSign', that)
        await that.$store.dispatch('getMyFriends')
        await that.$store.dispatch('getMyChannel')
        await that.$store.dispatch('getHostInfo')
        await that.$router.push('/index')
      } else {
        alert(loginStatus.message)
      }
    },
    getPassword: function () {
      this.password = storage.getInfo(this.phone)
    },
    getCaptcha: function () {
      $('#captcha').get(0).src = 'http://173.254.200.108:80/user/captcha' + '?' + new Date().getTime() / 1000
    },
    logout: function (event) {
      event.preventDefault()
      console.log('test logout')
      this.$store.dispatch('logout')
    }
  },
  created: function () {
    ipcRenderer.send('resizable', 0)
  }
}
</script>

<style scoped>
  .login{
    width: 100%;
    max-width: 780px;
    margin: 0 auto;
    height: 100%;
    /*-webkit-app-region: no-drag;*/
  }
  .dn{
    display: none;
  }
  .lf{
    text-align: left;
  }
  .lf>div{
    margin-bottom: 5px;
  }
  .loginBox{
    margin-top: 10px;
    margin-left: 0;
    margin-right: 0;
    -webkit-app-region: no-drag;
  }
  .loginBox>div{
    padding: 15px 30px;
  }
  #login-form-box{
    width: 100%;
  }
  @media screen and (min-width: 720px) {
    #login-form-box{
      width: 360px;
      margin: 0 auto;
    }
  }
  /*logo*/
  .logo{
    width: 100px;
    height: 100px;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 30px;
  }
  /*btn-action*/
  .btn-act{
    color: #fff;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    /*height: 90px;*/
    padding: 8px 0;
    /*min-height: 100px;*/
  }
  .si{
    width: 100%;
    padding: 5px 10px;
    background: #3d4;
    border-radius: 5px;
    transition: background 0.5s;
    border: none;
    cursor: pointer;
  }
  .si:hover{
    opacity: 0.9;
    background: #585858;
  }
  .si:focus{
    outline: none;
  }
  .f-pw{
    align-self: flex-end;
  }
  .input-wrapper{
    background: linear-gradient(90deg, #fff, #ccc 40%, #fff);
    padding: 0;
    padding-bottom: 2px;
  }
  .common-input{
    border: none;
    /*box-shadow: 0 2px 5px #d8d8d8;*/
    width: 100%;
    padding: 8px 5px;
    background: #fff;
    transition: all 0.5s;
  }
  .common-input:focus{
    outline: none;
  }
  #captcha-box{
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
  }
  #captcha{
    padding: 2px 0;
    height: 100%;
    margin-left: -56px;
    cursor: pointer;
  }
  .captcha-input{
    display: inline;
    float: left;
    border-bottom: none;
    box-shadow: 0 0 -30px #f00;
  }
  .captcha-input:focus{
    box-shadow: none;
  }
  .haventset{
    overflow: hidden;
    padding: 0 45px;
  }
  .hsp{
    background-color: #f33;
  }
</style>  