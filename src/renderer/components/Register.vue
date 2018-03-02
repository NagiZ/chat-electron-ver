<template>
  <div class="register">
    <back></back>
    <menu-action></menu-action>
    <div class="container-fluid row loginBox">
      <div id="login-form-box">
        <label class="register-label">注册/Regiseter</label>
        <form method="formMds" id="login-form" class="lf">
          <div class="input-wrapper">
            <input type="text" v-model="phone" class="common-input" name="phone" :placeholder="rtype" id="e-mail" title="Phone">
          </div>
          <div class="input-wrapper">
            <input type="password" v-model="password" class="common-input" name="password" placeholder="Password" id="password" title="Password">
          </div>
          <div class="input-wrapper">
            <input type="password" v-model="repassword" class="common-input" name="repassword" placeholder="Re Password" id="repassword" title="Enter Your Password Again" @change="pwvertify" @click="repw">
          </div>
          <p class="pwvertify" v-text="pwrequirement"></p>
          <div class="form-gorup input-wrapper" id="captcha-box">
            <input type="text" class="common-input captcha-input" v-model="captcha" placeholder="Captcha">
          <!-- http://173.254.200.108:80/user/captcha -->
            <img id="captcha" src="http://173.254.200.108:80/user/captcha" title="看不清？换一张"  @click="getCaptcha">
          </div>
          <div class="btn-act margin-top-medium">
            <button class="su" @click="register($event)">Register</button>
            <!-- <button class="su" @click="logout($event)">flash</button> -->
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import $ from 'jquery'
import menuAction from '@/components/Menu.vue'
import back from '@/components/Back.vue'
export default {
  name: 'Regiseter',
  components: {menuAction, back},
  data: () => {
    return {
      password: '',
      repassword: '',
      phone: '',
      captcha: '',
      pwrequirement: '以数字/字母开头，不能有空格'
    }
  },
  methods: {
    register: async function (event) {
      if (this.captcha.trim() === '') {
        return false
      }
      var that = this
      event.preventDefault()
      var registStatus = await that.$store.dispatch('register', that)
      if (registStatus.status === 200) {
        alert('Regist successfully!')
        await that.$store.dispatch('autoSign', that)
        await that.$store.dispatch('getMyFriends')
        await that.$store.dispatch('getHostInfo')
        await that.$store.dispatch('getMyChannel')
        await that.$router.push('index')
      } else {
        alert(registStatus.message)
      }
    },
    getCaptcha: function () {
      $('#captcha').get(0).src = 'http://173.254.200.108:80/user/captcha' + '?' + new Date().getTime() / 1000
    },
    pwvertify: function () {
      if (this.repassword !== this.password) {
        this.repassword = ''
        this.pwrequirement = '两次输入的密码必须一致'
        console.log(this.pwrequirement)
      }
    },
    repw: function () {
      this.pwrequirement = ''
    }
  },
  computed: {
    rtype: function () {
      var rt = this.$route.params.type
      var ph = ''
      if (rt === '以Steam') {
        ph = 'Your Steam Account'
      } else if (rt === '以手机') {
        ph = 'Your Phone Number'
      } else {
        ph = 'Your Email'
      }
      return ph
    }
  },
  created: function () {
    ipcRenderer.send('resizable', 0)
    console.log(this.$route.params.type)
  }
}
</script>

<style scoped>
  .register{
    width: 100%;
    height: 100%;
  }
  /**/
  .loginBox{
    margin-top: 10px;
    margin-left: 0;
    margin-right: 0;
    -webkit-app-region: no-drag;
  }
  .loginBox>div{
    padding: 15px 30px;
  }
  .register-label{
    font: bolder 18px '幼圆';
    color: #59f;
  }
  #login-form-box{
    width: 100%;
  }
  .pwvertify{
    color: #fd3515;
    font: 10px sans-serif;
    text-indent: 0.5em;
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
  .margin-top-medium{
    margin-top: 35px;
  }
  .su{
    width: 100%;
    padding: 5px 10px;
    background: #3d4;
    border-radius: 5px;
    transition: background 0.5s;
    border: none;
  }
  .su:hover{
    opacity: 0.9;
    background: #585858;
  }
  .su:focus{
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
</style>