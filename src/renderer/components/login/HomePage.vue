<template>
  <transition @leave="leave">
    <div class="regist">
      <menu-action></menu-action>
      <div class="bt"></div>
      <div class="h-box">
        <h2>Otaku.Chat 宅聊</h2>
        <h6>游戏动漫的大家族</h6>
        <div class="connect-types">
          <ul class="type-list">
            <li v-for="type in types" :class="['type-list-item', type === 'Steam' ? '' : type === 'Email' ? 't-email' : 't-phone']" @click="startRegist(type)">
              <b>{{type === 'Email' ? 'Sign Up With ' : 'Connect With '}}</b>
              <span>{{type}}</span>
            </li>
          </ul>
          <footer class="ft">Already have an account? <span class="signin" @click="signIn">Sign in now!</span></footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import menuAction from '@/components/commonCops/Menu.vue'
import {ipcRenderer} from 'electron'
import $ from 'jquery'

export default {
  name: 'RegistChoice',
  components: {menuAction},
  data: () => {
    return {
      types: ['Steam', 'Phone', 'Email']
    }
  },
  methods: {
    startRegist: function (t) {
      this.$router.push('/register/' + t)
    },
    signIn: function () {
      this.$router.push('/login')
    },
    leave: function (el, done) {
      $(el).animate({
        opacity: 0,
        width: 0
      }, 1000, function () {
        done()
      })
    }
  },
  created: function () {
    ipcRenderer.send('resizable', 0)
  }
}
</script>

<style scoped>
  .regist{
    width: 320px;
    height: 568px;
    margin: 0 auto;
    background: url(../../assets/pic/bg/defaulf-bg.jpg) no-repeat;
    background-position: center;
    background-size: 721px 568px;
    position: relative;
    font-family: sans-serif;
    overflow: hidden;
  }
  .bt{
    background-color: #000;
    opacity: 0.5;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .h-box{
    width: 100%;
    height: 548px;
    margin: 0 auto;
    padding: 172px 0 20px 0;
    text-align: center;
    position: relative;
    color: #fff;
  }
  .h-box>h2, .h-box>h6{
    -webkit-app-region: no-drag;
  }
  .connect-types{
    position: absolute;
    width: 100%;
    padding: 0 18px;
    bottom: 20px;
    -webkit-app-region: no-drag;
  }
  .type-list{
    list-style: none;
    padding: 0;
    font-size: 19px;
  }
  .type-list-item{
    display: block;
    height: 60px;
    line-height: 60px;
    background-color: #2a3f5a;
    border-radius: 2px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.3s;
    opacity: 0.85;
  }
  .type-list-item:hover{
    box-shadow: 0 0 5px #fff;
    opacity: 1;
  }
  .t-phone{
    background-color: #40c0ff;
  }
  .t-email{
    color: #efad62;
    background-color: #fff;
  }
  .ft{
    font-size: 12px;
  }
  .signin{
    font-weight: bolder;
    cursor: pointer;
  }
</style>