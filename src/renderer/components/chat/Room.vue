<template>
  <div class="room">
    <div class="chat-area  panel panel-default">
      <div class="chat-area">
        <div class="message" id="msglist">
          <div id="message-items" v-for="item in gms" :class="[item.data.type ? 'm-left' : 'm-right', 'msg-box']">
            <div :class="[item.data.type ? 'img-l' : 'img-r']">
              <img :src="item.data.avatar" alt="avatar" class="message-items-avatar">
              <p class="msg-from">{{item.data.name}}</p>
            </div>
            <div class="msg-body">
              <span class="created-time" v-text="toLocale(item.data.create_time)"></span>
              <p class="content" v-if="item.method === 'sendMessage'" v-text="item.data.message"></p>
              <img :src="item.data.src" v-if="item.method === 'sendImg'" class="msg-body-img">
            </div>
          </div>
        </div>
        <div class="input" id="input">
          <textarea v-model="msgInput" id="form-send" @paste = "sendImg($event)"></textarea>
          <button class="btn btn-default btn-send" @click='sendMessage'>
            <span>S</span>
          </button>
        </div>
      </div>
    </div>
    <div class="group-members-banner hidden-xs">
      <span class="group-member-collapse" @click="togSlideLeft($event)"></span>
      <div class="group-member-list">
        <ul class="list-group bg-trans">
          <li class="list-group-item bg-trans group-member-item bg-trans ti-sm" v-for="(value, key) in gmembers" @click="togSlide($event)">{{key}}
            <ul class="list-group">
              <li class="list-group-item sub-list-item font-sm ml-md" v-for="gm in value"><img class="gmavatar" src="#">{{gm}}</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!-- <router-view></router-view> -->
    <div :class="[gui.info_in ? 'infoIn' : 'infoOut', 'userDetail']">
      <div class="avatar">
        <img :src="gui.avatar" :alt="gui.basic.Name">
        <span>{{gui.basic.Name}}</span>
        <div class="menu-hide-user" @click="userInfoHide">
          <span class="glyphicon glyphicon-remove"></span>
        </div>
      </div>
      <div class="info-items">
        <p class="sub-item" v-for="(value, key) in gui.basic">
          <span class="key">{{key}}: </span>
          <span>{{value}}</span>
        </p>
      </div>
    </div>
    <div id="test-box"></div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
// import ch from '../config/cookieHandler.js'
import rA from '@/config/roomActions.js'
import $ from 'jquery'
import '@/assets/css/common-style.css'
export default {
  name: 'Room',
  data: () => {
    return {
      users: [{user: 'Nagi'}, {user: 'Nagi'}, {user: 'Nagi'}, {user: 'Nagi'}, {user: 'Nagi'}, {user: 'Nagi'}],
      msgInput: '',
      imgData: '',
      gmembers: {
        '群主': ['Nagi'],
        '自定义头领': ['Nagi01', 'Nagi02', 'Nagi03'],
        '成员/在线': ['kotomi01', 'kotomi02', 'kotomi03', 'kotomi04'],
        '成员/离线': ['雪菜', '雪菜', '雪菜', '雪菜']
      }
    }
  },
  methods: {
    togSlide: function (e) {
      $(e.target).children('ul').slideToggle()
    },
    togSlideLeft: function (e) {
      $(e.target).next('div').animate({width: 'toggle'}, 0)
      console.log($(e.target).next('div'))
    },
    sendMessage: function () {
      if (this.msgInput.trim().length === 0) {
        return false
      }
      console.log(rA.getHeight($('#msglist #message-items'), $('#msglist')))
      var sending = {
        method: 'sendMessage',
        data: {
          name: this.getUserInfo.name,
          id: this.getUserInfo.id,
          channel_id: this.getCurRoomId,
          message: this.msgInput.trim(),
          avatar: this.getUserInfo.avatar,
          create_time: Date.now()
        }
      }
      this.$store.dispatch('addToMsgList', sending)
      // rA.addMessage(this.messages, {message: this.msgInput.trim(), type: 0, from: 'host'}, $('#msglist #message-items'), $('#msglist'))
      this.msgInput = ''
      var ws = this.getWebSocket
      console.log(sending)
      ws.send(JSON.stringify(sending), (err) => {
        console.log(err)
      })
    },
    signout: function () {
      this.$store.dispatch('loginOut', this)
    },
    toLocale: function (timeStamp) {
      var date = new Date(timeStamp)
      // `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      return date.toLocaleTimeString()
    },
    userInfoHide: function () {
      this.$store.commit('showToInfo', {channel_id: this.getCurRoomId, showTag: 0})
    },
    sendImg: async function (e) {
      var d = document.getElementById('test-box')
      this.imgData = rA.imgTrans(e.clipboardData, d)
      if (!this.imgData) {
        return
      }
      var path = await this.$store.dispatch('sendImg', {data: this.imgData})
      console.log(path)
      var sendingImg = {
        method: 'sendImg',
        data: {
          name: this.getUserInfo.name,
          id: this.getUserInfo.id,
          channel_id: this.getCurRoomId,
          src: path.apath,
          avatar: this.getUserInfo.avatar,
          create_time: Date.now()
        }
      }
      this.$store.dispatch('addToMsgList', sendingImg)
      var ws = this.getWebSocket
      console.log(sendingImg)
      ws.send(JSON.stringify(sendingImg), (err) => {
        console.log(err)
      })
    }
  },
  watch: {
    gms: function (newMsg) {
      $('#msglist').animate({
        scrollTop: rA.getHeight($('#msglist #message-items'), $('#msglist'))
      })
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getRoomInfo',
      'getWebSocket',
      'getCurRoomId'
    ]),
    gms: function () {
      return this.$store.getters.getMsgListById(this.getCurRoomId)
    },
    gui: function () {
      return this.$store.getters.getInfoById(this.getCurRoomId)
    }
  },
  mounted: function () {
    this.$store.commit('showToInfo', {channel_id: this.getCurRoomId, showTag: 0})
  },
  created: function () {
    // var ut = ch.getCookieItem('user_token')
    // if (!ut || !this.getCurRoomId) {
    //   this.$router.push('/')
    // }
  }
}
</script>

<style scoped>
  .panel{
    margin-bottom: 0;
  }
  .ml-md{
    margin-left: 5px;
    margin-right: -5px;
  }
  /*common end*/
  .room{
    height: 100%;
    padding-right: 0;
    padding-left: 0;
    position: relative;
    overflow: hidden;
    display: flex;
  }
  /*member-area end*/
  .chat-area{
    width: 100%;
    height: 100%;
    border: none;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    flex: 1 1 auto;
  }
  .message{
    background-color: black;
    order: 0;
    min-height: 30%;
    flex: 5 3 auto;
    overflow-y: scroll;
    transition: all 0.3s;
  }
  .message::-webkit-scrollbar{
    display: none;
  }
  .msg-box{
    display: flex;
    text-align: left;
    margin-bottom: 20px;
  }
  .m-left{
    justify-content: flex-start;
  }
  .m-right{
    justify-content: flex-end;
  }
  .img-l{
    order: 0;
    flex: 0 0 auto;
  }
  .img-r{
    order: 2;
    flex: 0 0 auto;
  }
  .msg-from{
    font-size: 20px;
    color: #f15;
    font-style: italic;
  }
  .msg-body{
    display: flex;
    flex-direction: column;
    /*margin: 3px 10px;
    padding: 3px 10px;
    word-break: break-all;
    background-color: #fff;
    box-shadow: 0 0 10px #e8e8e8;
    border-radius: 5px;*/
    flex: 0 1 auto;
  }
  .created-time{
    color: #a8a8a8;
    margin: -5px 0 0 10px;
  }
  .content{
    margin: 3px 10px;
    padding: 3px 10px;
    word-break: break-all;
    background-color: #fff;
    box-shadow: 0 0 10px #e8e8e8;
    border-radius: 5px;
    flex: 0 1 auto;
  }
  .msg-body-img{
    padding: 15px;
    max-width: 100%;
  }
  /*input && send*/
  .input{
    display: flex;
    justify-content: space-between;
    order: 1;
    align-items: center;
    height: 5%;
    margin-right: -11px;
    min-height: 50px;
    flex: 0 1 auto;
    box-shadow: 0 0 10px #4f9;
  }
  .input>textarea{
    display: block;
    flex: 1 1 auto;
    height: 100%;
    border: none;
  }
  .input>textarea:focus{
    outline: none;
  }
  .btn-img{
    display: block;
    font-size: 25px;
    border-radius: 0;
    height: 100%;
  }
  .btn-send{
    display: block;
    text-align: center;
    font-size: 25px;
    height: 100%;
    min-width: 50px;
    border-radius: 0;
    border: 2px solid #e8e8e8;
    /*border-left: none;*/
  }
  .btn-send:focus{
    outline: none;
  }
  .btn-send:hover{
    text-shadow: 
  }
  /*info area*/
  .userDetail{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    top: 0;
    margin: 0;
    padding: 0;
    background-color: #383838;
    transition: all 0.3s;
    overflow-y: scroll;
    color: #fff;
    text-align: left;
  }
  .infoOut{
    left: 100%;
  }
  .infoIn{
    left: 0;
  }
  .avatar{
    position: relative;
    height: 40%;
    flex: 0 0 auto;
    padding: 55px 60px;
    font-size: 30px;
  }
  .avatar>img{
    width: 120px;
    height: 120px;
    border-radius: 120px;
    margin-right: 50px;
  }
  .info-items{
    padding: 0 60px;
    flex: 1 0 auto;
    border-top: 10px solid #353535;
  }
  .sub-item{
    padding: 10px;
    margin: 10px; 
  }
  .sub-item>.key{
    color: #007854;
    margin-right: 5px;
  }
  .menu-hide-user{
    position: absolute;
    padding: 5px;
    right: 0;
    top: 0;
    font-size: 26px;
    color: #121212;
    z-index: 100;
    transition: all 0.3s;
    cursor: pointer;
  }
  .menu-hide-user>span{
    transition: all 0.3s;
  }
  .menu-hide-user:hover>span{
    text-shadow: 0 0 10px #aaa;
    /*box-shadow: 0 0 10px #aaa;*/
  }
  .message-items-avatar{
    margin-top: 10px;
    width: 40px;
    height: 40px;
    border-radius: 40px;
  }
  /*group-members-list*/
  .group-members-banner{
    position: relative;
    margin: 10px 5px;
    margin-left: 10px;
    padding-left: 5px;
    border-left: 1px solid #fff;
  }
  @media screen and (max-width: 840px){
    .group-members-banner{
      display: none;
    }
  }
  .group-member-collapse{
    display: block;
    border: 2px solid #fff;
    border-radius: 2px;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    position: absolute;
    width: 20px;
    height: 40px;
    left: 2px;
    top: 50%;
    transition: all 0.3s;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .group-member-collapse:hover{
    box-shadow: 0 0 10px #fff;
    background-color: #989898;
  }
  .group-member-list{
    height: 100%;
    overflow-y: scroll;
    width: 120px;
    padding-top: 10px;
  }
  .group-member-list::-webkit-scrollbar{
    display: none;
  }
  .group-member-item{
    padding: 0;
    padding-bottom: 5px;
    cursor: pointer;
  }
  .sub-list-item{
    position: relative;
    vertical-align: middle;
    padding: 4px 18px;
    height: 30px;
    color: #fff;
    border-radius: 0;
    background-color: transparent;
    box-shadow: 0 0 5px #000;
    overflow: hidden;
  }
  .sub-list-item:hover{
    background-color: #f05;
    box-shadow: 0 0 50px #000;
  }
  .gmavatar{
    width: 20px;
    height: 20px;
    margin-left: -20px;
  }
</style>