<template>
  <transition @beforeEnter="be" @enter="enter">
    <div class="register">
      <back></back>
      <menu-action></menu-action>
      <div class="bt"></div>
      <div class="loginBox">
        <img src="../../assets/pic/bg/defaulf-ava.jpg" alt="default avatar" class="r-avatar">
        <div id="login-form-box">
          <form method="formMds" id="login-form" class="lf">
            <div class="input-wrapper">
              <input type="text" v-model="username" class="common-input" name="uname" placeholder="Username" id="uname" title="Username">
            </div>
            <div class="input-wrapper">
              <input type="text" v-model="phone" :class="['common-input', vp ? '' : 'warning']" name="phone" :placeholder="rtype" id="e-mail" title="Phone" @change="changeActions('account')" @input="inputActions('account')">
              <span v-if="instructions.account.hrs" :class="['instruction', instructions.account.text ? 'text-warning' : '']">{{instructions.account.text || 'example@abc.com'}}</span>
            </div>
            <div class="input-wrapper">
              <input type="password" v-model="password" :class="['common-input', vpw ? '' : 'warning']" name="password" placeholder="Password" id="password" title="Password" @input="inputActions('pwd')" @change="changeActions('pwd')">
              <span v-if="instructions.pwd.hrs" :class="['instruction', instructions.pwd.text ? 'text-warning' : '']">{{instructions.pwd.text || 'At least 6 Characters'}}</span>
            </div>
            <div class="input-wrapper">
              <input type="password" v-model="repassword" :class="['common-input', vpr ? '' : 'warning']" name="repassword" placeholder="Re Password" id="repassword" title="Enter Your Password Again" @change="changeActions('prtype')" @input="inputActions('prtype')">
              <span v-if="instructions.prtype.hrs" :class="['instruction', instructions.prtype.text ? 'text-warning' : '']">{{instructions.prtype.text || 'At least 6 Characters'}}</span>
            </div><!-- 
            <p class="pwvertify" v-text="pwrequirement"></p>
            <div class="form-gorup input-wrapper" id="captcha-box">
              <input type="text" class="common-input captcha-input" v-model="captcha" placeholder="Captcha"> -->
            <!-- http://173.254.200.108:80/user/captcha -->
              <!-- <img id="captcha" src="http://173.254.200.108:80/user/captcha" title="看不清？换一张"  @click="getCaptcha">
            </div> -->
            <button class="sign-up" @click="register($event)">Done</button>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {ipcRenderer} from 'electron'
import $ from 'jquery'
import vi from '@/config/vertify'
import menuAction from '@/components/commonCops/Menu.vue'
import back from '@/components/commonCops/Back.vue'
export default {
  name: 'Regiseter',
  components: {menuAction, back},
  data: () => {
    return {
      username: '',
      password: '',
      repassword: '',
      phone: '',
      // captcha: '',
      vp: true,
      vpw: true,
      vpr: true,
      instructions: {
        account: {text: '', hrs: 1},
        pwd: {text: '', hrs: 1},
        prtype: {text: '', hrs: 1}
      }
    }
  },
  methods: {
    be: function (el) {
      $(el).css({
        width: 0,
        opacity: 0
      })
    },
    enter: function (el, done) {
      $(el).animate({
        opacity: 1,
        width: 320
      }, 1000, function () {
        done()
      })
    },
    gi: function () {
      this.$router.push('index')
    },
    register: async function (event) {
      event.preventDefault()
      event.stopPropagation()
      if (!this.vp || !this.vpw || !this.vpr) {
        return
      }
      var that = this
      var registStatus = await that.$store.dispatch('register', that)
      if (registStatus.status === 200) {
        alert('Regist successfully!')
        await that.$store.dispatch('autoSign', that)
        await that.$store.dispatch('getMyFriends')
        await that.$store.dispatch('getHostInfo')
        await that.$store.dispatch('getMyChannel')
        console.log('sss')
        await that.$router.push('/index')
      } else {
        alert(registStatus.message)
      }
    },
    getCaptcha: function () {
      $('#captcha').get(0).src = 'http://173.254.200.108:80/user/captcha' + '?' + new Date().getTime() / 1000
    },
    pwvertify: function () {
      if (this.repassword !== this.password) {
        // this.repassword = ''
        this.instruction.prtype = '输入必须一致'
      }
    },
    changeActions: function (tag) {
      switch (tag) {
        case 'account' :
          if (!vi.supVertify(this.phone)) {
            this.vp = false
            this.instructions.account.text = 'Account Format Error'
            this.instructions.account.hrs = 1
          }
          break
        case 'pwd' :
          if (!vi.pwTest(this.password)) {
            this.vpw = false
            this.instructions.pwd.text = 'Password Is Too Short'
            this.instructions.pwd.hrs = 1
          }
          break
        case 'prtype' :
          if (this.repassword !== this.password) {
            this.vpr = false
            this.instructions.prtype.text = 'Input Inconsistent'
            this.instructions.prtype.hrs = 1
          }
          break
        default: break
      }
    },
    inputActions: function (tag) {
      switch (tag) {
        case 'account' :
          this.instructions.account.text = ''
          this.instructions.account.hrs = 0
          this.vp = true
          break
        case 'pwd' :
          this.instructions.pwd.text = ''
          this.instructions.pwd.hrs = 0
          this.vpw = true
          break
        case 'prtype' :
          this.instructions.prtype.text = ''
          this.instructions.prtype.hrs = 0
          this.vpr = true
          break
        default: break
      }
    }
  },
  computed: {
    rtype: function () {
      var rt = this.$route.params.type
      var ph = ''
      if (rt === 'Steam') {
        ph = 'Your Steam Account'
      } else if (rt === 'Phone') {
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
  /*@import '../../assets/css/login/regist.css'*/
.register{
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
  overflow: hidden;
 }
.r-avatar{
  display: block;
  width: 85px;
  height: 85px;
  border-radius: 50px;
  margin: 30px auto;
}
#login-form-box{
  margin: 0 auto;
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
.instruction{
  position: absolute;
  font-size: 13px;
  color: #6c6c6c;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
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
  display: flex;
  justify-content: space-between;
}
#uname::-webkit-input-placeholder{
  text-align: center;
  font-size: 15px;
  font-weight: bold;
}
.sign-up{
  width: 100%;
  height: 60px;
  color: #fff;
  background-color: #f80;
  border: none;
  border-radius: 2px;
  margin-top: 54px;
  cursor: pointer;
  transition: all 0.3s;
}
.sign-up:hover{
  box-shadow: 0 0 5px #fff;
}
.warning{
  box-shadow: 0 0 25px #f40;
}
.text-warning{
  color: #f00;
  text-shadow: 0 0 5px #f00;
}
</style>