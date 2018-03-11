<template>
  <div class="main-box">
    <menu-actions></menu-actions>
    <div class="logo">
      <img src="../assets/logo.png" alt="Otaku Chat~" title="Otaku Chat~">
    </div>
    <div class="login-actions">
      <button class="sign-in" @click="signIn">登入</button>
      <button class="sign-up" @click="signUp">注册</button>
    </div>
  </div>
</template>
<script>
// import $ from 'jquery'
import {ipcRenderer} from 'electron'
// import storage from '../store/storage'
import menuActions from '@/components/Menu.vue'
export default {
  name: 'Homepage',
  components: {menuActions},
  methods: {
    minimize: function () {
      ipcRenderer.send('min')
    },
    close: function () {
      ipcRenderer.send('close')
    },
    signIn: function () {
      this.$router.push('/login')
    },
    signUp: function () {
      this.$router.push('/registchoice')
    }
  },
  created: function () {
    ipcRenderer.send('resizable', 0)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-box{
    height: 100%;
    width: 100%;
    position: relative;
    /*-webkit-app-region: no-drag;*/
  }
  .menu-actions{
    background-color: #a2a2a2;
    height: 20px;
    overflow: hidden;
  }
  .menu-mark{
    display: inline-block;
    padding: 0 5px;
    height: 100%;
  }
  .menu-mark-sub{
    display: block;
    padding: 0 5px;
    width: 100%;
    transition: all 0.3s;
  }
  .menu-mark:hover{
    box-shadow: 0 0 5px #fff;
  }
  .menu-minimize{
    background-color: #333;
    height: 2px;
    margin-top: 9px;
  }
  .menu-maximize{
    border: 2px solid #333;
    border-radius: 3px;
    padding: 4px;
    margin-top: 4px;
  }
  .menu-close{
    background: url(../assets/close.png) no-repeat;
    background-size: contain;
    padding: 8px;
    margin-top: 2px;
  }
  /*logo*/
  .logo{
    width: 200px;
    height: 200px;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 30px;
  }
  /*sign action*/
  .login-actions{
    position: absolute;
    width: 200px;
    left: 50px;
    bottom: 50px;
  }
  .sign-in, .sign-up{
    width: 100%;
    padding: 5px 10px;
    background: #3d4;
    border-radius: 5px;
    transition: background 0.5s;
    border: none;
    margin-top: 10px;
    cursor: pointer;
  }
  .sign-up{
    background-color: #383838;
  }
  .sign-in:hover, .sign-up:hover{
    opacity: 0.9;
    background: #585858;
  }
  .sign-in:focus, .sign-up:focus{
    outline: none;
  }
</style>
