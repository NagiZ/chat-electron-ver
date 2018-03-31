<template>
  <div class="login">
    <back></back>
    <menu-action></menu-action>
    <div class="bt"></div>
    <!-- <div class="logo">
      <img src="../../assets/close.png" alt="Otaku Chat~" title="Otaku Chat~">
    </div> -->
    <div class="loginBox">
      <div id="login-form-box">
        <form method="formMds" id="login-form" class="lf">
          <div class="input-wrapper">
            <input type="text" v-model="phone" :class="['common-input', vp ? '' : 'warning']" name="phone" placeholder="Phone / Email" id="e-mail" title="Phone" @change="changeActions('account')" @input="inputActions('account')">
            <span v-if="linstructions.account.hrs" :class="['instruction', linstructions.account.text ? 'text-warning' : '']">{{linstructions.account.text}}</span>
          </div>
          <div class="input-wrapper">
            <input type="password" v-model="password" :class="['common-input', vpw ? '' : 'warning']" name="password" placeholder="Password" id="password" title="Password" @input="inputActions('pwd')" @change="changeActions('pwd')">
            <span v-if="linstructions.pwd.hrs" :class="['instruction', linstructions.pwd.text ? 'text-warning' : '']">{{linstructions.pwd.text || 'At least 6 characters'}}</span>
          </div>
          <!-- <div class="form-gorup input-wrapper" id="captcha-box">
            <input type="text" class="common-input captcha-input" v-model="captcha" placeholder="Captcha"> -->
          <!-- http://173.254.200.108:80/user/captcha -->
            <!-- <img id="captcha" src="http://173.254.200.108:80/user/captcha" title="看不清？换一张"  @click="getCaptcha">
          </div> -->
          <div class="btn-act">
            <button class="sign-in" @click="sign($event)">Done</button>
            <!-- <a href="#"><span>Forget Password</span></a> -->
          </div>
        </form>
      </div>
    </div>
  <!--   <div class="haventset">
      <button class="si hsp" @click="cw">Haven't Set Password</button>
    </div> -->
  </div>
</template>

<script>
import $ from 'jquery'
import {ipcRenderer} from 'electron'
import storage from '@/store/storage'
import vi from '@/config/vertify'
import menuAction from '@/components/commonCops/Menu.vue'
import back from '@/components/commonCops/Back.vue'
export default {
  name: 'Login',
  components: {menuAction, back},
  data () {
    return {
      password: '',
      phone: '',
      vp: true,
      vpw: true,
      linstructions: {
        account: {text: '', hrs: 1},
        pwd: {text: '', hrs: 1}
      }
      // captcha: ''
    }
  },
  methods: {
    cw: function () {
      this.$store.state.ws = new WebSocket('ws://173.254.200.108:2333')
    },
    sign: async function (event) {
      event.preventDefault()
      event.stopPropagation()
      // if (this.captcha.trim() === '') {
      //   return false
      // }
      if (!this.vp || !this.vpw) {
        return
      }
      var that = this
      var loginStatus = await that.$store.dispatch('sign', that)
      if (loginStatus.status === 200) {
        alert('Login successfully!')
        await that.$store.dispatch('autoSign', that)
        await that.$store.dispatch('getMyFriends')
        await that.$store.dispatch('getMyChannel')
        await that.$store.dispatch('getHostInfo')
        await that.$router.push('/index')
      } else {
        if (loginStatus.message === '密码错误') {
          this.vpw = false
          this.linstructions.pwd.text = 'Password Wrong'
          this.linstructions.pwd.hrs = 1
        } else if (loginStatus.message === '用户不存在') {
          this.vp = false
          this.linstructions.account.text = 'No Such Account'
          this.linstructions.account.hrs = 1
        }
      }
    },
    getCaptcha: function () {
      $('#captcha').get(0).src = 'http://173.254.200.108:80/user/captcha' + '?' + new Date().getTime() / 1000
    },
    changeActions: function (tag) {
      switch (tag) {
        case 'account':
          if (!vi.supVertify(this.phone)) {
            this.vp = false
            this.linstructions.account.text = 'Account  Format Error'
            this.linstructions.account.hrs = 1
          }
          this.password = storage.getInfo(this.phone)
          break
        case 'pwd':
          if (!vi.pwTest(this.password)) {
            this.vpw = false
            this.linstructions.pwd.text = 'Password Is Too Short'
            this.linstructions.pwd.hrs = 1
          }
          break
        default: break
      }
    },
    inputActions: function (tag) {
      switch (tag) {
        case 'account':
          this.linstructions.account.text = ''
          this.linstructions.account.hrs = 0
          this.vp = true
          break
        case 'pwd':
          this.linstructions.pwd.text = ''
          this.linstructions.pwd.hrs = 0
          this.vpw = true
          break
        default: break
      }
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
  /*@import '../../assets/css/login/login.css'*/
  .login{
    width: 320px;
    height: 568px;
    margin: 0 auto;
    background: url('../../assets/pic/bg/blur-bg.jpg');
    background-position: center;
    background-size: 721px 568px;
    font-family: sans-serif;
    position: relative;
    overflow: hidden;
  }
  .bt{
    background-color: #000;
    opacity: 0.5;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .loginBox{
    width: 100%;
    height: 548px;
    position: relative;
  }
  #login-form-box{
    margin: 0 auto;
    margin-top: 208px;
    position: absolute;
    width: 100%;
    padding: 0 18px;
  }
  .lf{
    width: 100%;
  }
  .input-wrapper{
    margin-bottom: 8px;
    position: relative;
  }
  .common-input{
    width: 100%;
    height: 50px;
    font-size: 15px;
    padding: 0 15px;
    border-radius: 2px;
    border: none;
    background-color: #9c9c9c;
  }
  .common-input::-webkit-input-placeholder{
    color: #6c6c6c;
    font-size: 13px;
  }
  .sign-in{
    width: 100%;
    height: 60px;
    color: #fff;
    background-color: #f80;
    border: none;
    border-radius: 2px;
    margin-top: 111px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .sign-in:hover{
    box-shadow: 0 0 5px #fff;
  }
  .instruction{
    position: absolute;
    font-size: 13px;
    color: #6c6c6c;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
  .warning{
    box-shadow: 0 0 25px #f40;
  }
  .text-warning{
    color: #f00;
    text-shadow: 0 0 5px #f00;
  }
</style>  