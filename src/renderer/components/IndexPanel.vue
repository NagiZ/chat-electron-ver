<template>
  <div class="IndexPanel" @click="reset($event)">
    <nav class="navbar-inverse" style="height: 29px;">
      <menu-sup></menu-sup>
      <!-- <div class="container-fluid no-margin full-height">
        <div class="row full-height">
          <div class="col-md-4 col-sm-4 col-xs-4 newId np full-height">
            <div class="full-height">
              <span @click="hostInfoShow"  @click="toHome"> INFOS（未完成） </span>
              <span style="margin-left: 100px;" @click="getMyc">未完成</span>
            </div>
          </div>
          <div class="col-md-8 col-sm-8 col-xs-8">
            <div class="avatar" id="avatar" v-if="avatarShow" @click="userInfoShow(gui.info_in)">
              <img :src="chatTo.avatar" :alt="chatTo.name">
            </div>
          </div>
        </div>
      </div> -->
    </nav>
    <!-- navigation end ->-> -->
    <div class="container-fluid panel-area">
      <div class="row panel-box">
        <div class="hostInfo col-md-4 col-sm-4 col-xs-4" id="hostInfo">
          <div class="na">
            <div>
              <img :src="getUserInfo.avatar" :alt="getUserInfo.name" style="margin-left: 10px;">
              <span class="modify" @click="setting($event)">更换</span>
            </div>
            <div>
              <span v-text="getUserInfo.name" id="name" style="margin-left: 10px;"></span>
              <span class="modify" @click="setting">修改</span>
            </div>
            <div>
              <p>Phone: <span v-text="getUserInfo.phone"></span></p>
              <p>User ID: <span v-text="getUserInfo.id"></span></p>
            </div>
          </div>
          <ul class="list-group host-detail" style="margin-bottom: 0;">
            <li class="list-group-item" @click="addFriendOrChannel($event, 1)"><span>New Channel</span></li>
            <li class="list-group-item" @click="addFriendOrChannel($event, 0)"><span>New Friend</span></li>
            <li class="list-group-item text-danger">Sign out</li>
          </ul>
          <div class="menu-hide-host" @click="hostInfoHide">
            <span class="glyphicon glyphicon-remove">H I D E</span>
          </div>
        </div>
        <div class="member-area col-md-4 col-sm-4 col-xs-4 panel panel-default">
          <!-- 左侧头像 -->
          <div class="avatar-line">
            <div id="avatar-first" @click="toHome"><img :src="getUserInfo.avatar" :alt="getUserInfo.name" class="avatar-line-item"></div>
            <img :src="getUserInfo.avatar" :alt="getUserInfo.name" class="avatar-line-item">
            <img :src="getUserInfo.avatar" :alt="getUserInfo.name" class="avatar-line-item">
            <div class="hostInfoBtn" id="hostInfoBtn" @click="hostInfoShow">
              <span class="glyphicon glyphicon-cog">--></span>
            </div>
          </div>
          <!-- 成员列表 -->
          <div class="index-group">
            <div class="flex-col full-height" v-if="!isEnterPrivate">
              <div class="search-area">
                <input type="text">
                <span class="switchBtn switch-active" @click="switchRow($event, 'friends')">好友</span>
                <span class="switchBtn" @click="switchRow($event, 'private groups')">私人群</span>
                <span class="switchBtn" @click="switchRow($event, 'public')">公开频道</span>
              </div>
              <div class="member-list-banner">
                <ul class="list-group member-list-ul" v-show="chosen === 'friends'">
                  <li class="list-group-item group-item" @click="togSlide($event)">Group A
                  </li>
                  <ul class="list-group" id="private">
                    <li class="list-group-item sub-list-item" v-for="item in getSocialCircle" @click="getIn($event, item.channel_id)">
                      <img :src="item.avatar" :alt="item.name">
                      <span>{{item.name}}</span>
                      <!-- 是否有未读，未读数目。进入channel则置零该channel未读数 -->
                      <span class="badge badge-sub" title="Unread Messages" v-if="item.unread" v-text="item.unread"></span>
                      <p v-if="item.messages[0]" v-text="item.messages[item.messages.length - 1].data.message"></p>
                    </li>
                  </ul>
                  <li class="list-group-item group-item" @click="togSlide($event)">Group A
                  </li>
                  <ul class="list-group" id="public">
                    <li class="list-group-item sub-list-item" v-for="item in getSocialCircle" @click="getIn($event, item.channel_id)">
                      <img :src="item.avatar" :alt="item.name">
                      <span>{{item.name}}</span>
                      <!-- 是否有未读，未读数目。进入channel则置零该channel未读数 -->
                      <span class="badge badge-sub" title="Unread Messages" v-if="item.unread" v-text="item.unread"></span>
                      <p v-if="item.messages[0]" v-text="item.messages[item.messages.length - 1].data.message"></p>
                    </li>
                  </ul>
                </ul>
                <ul class="list-group member-list-ul" v-show="chosen === 'private groups'">
                  <li class="list-group-item group-item" @click="enterPrivate">Private Group A</li>
                  <li class="list-group-item group-item">Private Group B</li>
                  <li class="list-group-item group-item">Private Group C</li>
                  <li class="list-group-item group-item">Private Group D</li>
                  <li class="list-group-item group-item">Private Group E</li>
                  <li class="list-group-item group-item">Private Group F</li>
                </ul>
                <ul class="list-group member-list-ul" v-show="chosen === 'public'">
                  <li class="list-group-item group-item">Public Group A</li>
                  <li class="list-group-item group-item">Public Group B</li>
                  <li class="list-group-item group-item">Public Group C</li>
                  <li class="list-group-item group-item">Public Group D</li>
                  <li class="list-group-item group-item">Public Group E</li>
                  <li class="list-group-item group-item">Public Group F</li>
                </ul>
              </div>
              <div style="padding: 15px; margin: 5px 5px;">
                <span class="aabbccdd" @click="addFriendOrChannel($event, 0)"></span>
              </div>
            </div>
            <pg-column v-if="isEnterPrivate"></pg-column>
            <!-- <ul class="list-group" id="private">
              <li class="list-group-item sub-list-item" v-for="item in getSocialCircle" @click="getIn($event, item.channel_id)">
                <img :src="item.avatar" :alt="item.name">
                <span>{{item.name}}</span>
                是否有未读，未读数目。进入channel则置零该channel未读数
                <span class="badge badge-sub" title="Unread Messages" v-if="item.unread" v-text="item.unread"></span>
                <p v-if="item.messages[0]" v-text="item.messages[item.messages.length - 1].data.message"></p>
              </li>
            </ul> -->
          </div>
        </div>
        <div class="message-banner col-md-8 col-sm-7 col-xs-8">
          <div class="full-width avatar-banner">
            <span class="m-ops" v-for="op in ops">{{op}}</span>
            <div class="avatar" id="avatar" v-if="avatarShow" @click="userInfoShow(gui.info_in)">
              <img :src="chatTo.avatar" :alt="chatTo.name">
            </div>
          </div>
          <router-view></router-view>
        </div>
      </div> 
    </div>
    <div class="action-addFriend" v-if="addShow">
      <input type="text" v-model="newId" placeholder="ID"></input>
      <button @click="chaOrFri($event)">
        <b v-text="channelOrFriend"></b>
      </button>
      <button @click="hidePannel">关闭</button>
    </div>
    <div class="setting-panel container panel dn" v-if="set">
    </div>
    <div class="setting" id="setting" v-if="set">
      <h4>修改用户名/更换头像</h4>
      <div class="setting-item-name">
        <input type="text" placeholder="输入新用户名" id="username-input">
        <span class="btn comfirm" id="confirm-name" @click="changeName">确认</span>
      </div>
      <div class="setting-item-avatar">
        <canvas width="100" height="100" id="canvas">
          ...
        </canvas>
        <canvas id="canvas_sub" width="480" height="240" v-show="am"></canvas>
        <img src="" id="img_sub" class="dn">
        <div>
          <input type="file" id="avatar-file" class="dn" accept="image/*" enctype="multipart/form-data">
          <button class="btn btn-success" id="file-select" @click="selectImg($event)">选择文件</button>
          <span class="btn comfirm" id="confirm-avatar" @click="changeavatar">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import $ from 'jquery'
import iA from '../config/indexAction.js'
import {ipcRenderer} from 'electron'
import menuSup from '@/components/Menusup.vue'
import pgColumn from '@/components/PGColumn.vue'
export default {
  name: 'IndexPanel',
  components: {menuSup, pgColumn},
  data: () => {
    return {
      roomList: [{name: 'Animation', id: 1}, {name: 'Comic', id: 2}, {name: 'Music', id: 3}, {name: 'Film', id: 4}, {name: 'Games', id: 5}, {name: 'Novels', id: 6}],
      newId: '',
      chatTo: {},
      avatarShow: false,
      set: false,
      am: false,
      aData: '',
      addShow: false,
      channelOrFriend: '',
      showm: true,
      chosen: 'friends',
      ops: ['主页', '动态', '通知', '更多', '发布动态'],
      isEnterPrivate: false
    }
  },
  methods: {
    reset: function (e) {
      // e.preventDefault()
    },
    getMyc: function () {
      this.$router.push('/')
    },
    toHome: function () {
      this.$router.push('/')
    },
    getHostInfo: function () {
      this.$store.dispatch('getHostInfo', this)
    },
    getIn: function (e, id) {
      e.stopPropagation()
      switch (e.which) {
        case 1 :
          this.$store.dispatch('getInChannel', {obj: this, id: id})
          break
        case 2 :
          this.$store.dispatch('getFriendInfo', id)
          break
        default: break
      }
    },
    togSlide: function (e) {
      $(e.target).next('ul').slideToggle()
    },
    hidePannel: function (e) {
      this.addShow = false
    },
    addFriendOrChannel: function (e, tg) {
      e.preventDefault()
      e.stopPropagation()
      console.log(tg)
      var cTag = this.channelOrFriend
      if (tg === 0) {
        if (cTag === '添加') {
          this.addShow = false
          this.channelOrFriend = ''
          this.newId = ''
          return
        }
        this.channelOrFriend = '添加'
      } else if (tg === 1) {
        if (cTag === '创建') {
          this.addShow = false
          this.channelOrFriend = ''
          this.newId = ''
          return
        }
        this.channelOrFriend = '创建'
      }
      console.log(this.channelOrFriend)
      this.addShow = true
    },
    chaOrFri: async function (e) {
      e.preventDefault()
      var result = {}
      if (this.channelOrFriend === '添加') {
        result = await this.$store.dispatch('addFriend', this)
        if (result.status === 200) {
          await this.$store.dispatch('getMyFriends')
          this.addShow = false
        }
        console.log(result.message)
      } else if (this.channelOrFriend === '创建') {
        result = await this.$store.dispatch('createChannel', this)
        if (result.status === 200) {
          await this.$store.dispatch('getMyChannel')
          alert(result.message)
        }
      }
    },
    hostInfoShow: function () {
      $('#hostInfo').addClass('noleft')
      $('#hostInfoBtn').addClass('dn')
    },
    hostInfoHide: function () {
      $('#hostInfo').removeClass('noleft')
      $('#hostInfoBtn').removeClass('dn')
    },
    // switch users row
    switchRow: function (e, par) {
      console.log($())
      $('.switchBtn').removeClass('switch-active')
      $(e.target).addClass('switch-active')
      this.chosen = par
    },
    enterPrivate: function () {
      this.isEnterPrivate = true
    },
    userInfoShow: function (tag) {
      var st = tag === true ? 0 : 1
      this.$store.commit('showToInfo', {channel_id: this.getCurRoomId, show_tag: st})
    },
    setting: function (e) {
      e.stopPropagation()
      this.set = true
    },
    changeName: async function () {
      var ifok = await this.$store.dispatch('changeName', {new_name: $('#username-input').val()})
      console.log(ifok)
      if (ifok) {
        alert('修改成功')
        $('#username-input').val('')
        this.set = false
      }
    },
    changeavatar: async function () {
      var cvs = document.getElementById('canvas')
      this.aData = iA.canvasData(cvs, this.getUserInfo.name)
      var ifsuccess = await this.$store.dispatch('changeAvatar', {data: this.aData})
      console.log(ifsuccess)
      if (ifsuccess.status === 'success') {
        alert('修改成功')
        // 低版本浏览器无效 待改进
        $('#vatar-file').val('')
        var ctx = document.getElementById('canvas_sub').getContext('2d')
        $('#canvas_sub').get(0).onmousemove = function () {
          return false
        }
        ctx.clearRect(0, 0, 420, 280)
        this.set = false
        this.am = false
        await this.$store.dispatch('getHostInfo')
      }
    },
    selectImg: function (e) {
      e.stopPropagation()
      var left = $('.setting-item-avatar').get(0).offsetWidth - 480
      this.am = true
      $('#canvas_sub').css('left', left / 2)
      iA.changeA($('#avatar-file'), $('#canvas'), $('#canvas_sub'), $('#img_sub'), 64)
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getSocialCircle',
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
  },
  created: async function () {
    ipcRenderer.send('resizable', 1)
    // var obj = {id: ch.getCookieItem('id'), user_token: ch.getCookieItem('user_token')}
    // if (this.getUserInfo.token) {
    //   return
    // }
    // if (obj.user_token) {
    //   await this.$store.dispatch('skipLogin', obj)
    // } else {
    //   this.$router.push('/')
    // }
  }
}
</script>

<style scoped>
  .full-height{
    height: 100%;
  }
  .full-width{
    width: 100%;
  }
  input:focus{
    outline: none!important;
  }
  ul, li{
    background-color: transparent;
  }
  li{
    transition: all 0.3s;
    background-color: transparent;
  }
  li:hover{
    cursor: pointer;
    text-shadow: 0 0 10px #fff;
  }
  .switch-active{
    background-color: #f00;
    box-shadow: 0 0 10px #fff;
  }
  .member-list-ul{
    position: absolute;
    width: 100%;
  }
  .np{
    padding: 0;
  }
  .panel{
    margin-bottom: 0;
  }
  .dn{
    display: none;
  }
  .fl{
    float: left;
  }
  #navigation{
    margin-bottom: 0;
  }
  .panel-area{
    width: 100%;
    height: 100%;
    padding-top: 29px;
    margin-top: -29px;
  }
  .panel-box{
    height: 100%;
    background-color: #000;
    -webkit-app-region: no-drag;
  }
  /*common end*/
  nav{
    background-color: #555;
  }
  .member-area{
    position: relative;
    min-width: 270px;
    border: none;
    border-radius: 0;
    height: 100%;
    padding-left: 0;
    padding-right: 0;
    overflow: hidden;
    overflow-y: scroll;
    height: 100%;
    background: #353535;
  }
  .index-group{
    height: 100%;
    margin-left: 70px;
    overflow: hidden;
  }
  .flex-col{
    display: flex;
    flex-direction: column;
  }
  .member-area::-webkit-scrollbar{
    display: none;
  }
  .IndexPanel{
    height: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 2px;
    width: 100%;
  }
  /*index*/
  .index{
    height: 100%;
    padding: 5px;
    background-color: #af0;
  }
  .search-area{
    padding: 15px 10px;
    padding-bottom: 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #fff;
  }
  .search-area>input{
    display: block;
    margin: 0 auto;
    background-color: #e8e8e8;
    border: none;
    border-radius: 2px;
    padding: 1px 5px;
  }
  .search-area>span{
    display: inline-block;
    margin: 15px 5px;
    padding: 2px;
    color: #fff;
    font-size: 12px;
    border: 1px solid #fff;
    border-radius: 2px;
    cursor:pointer;
  }
  .search-area>span:hover{
    box-shadow: 0 0 5px #fff;
  }
  .no-margin{
    margin: 0;
  }
  .no-border{
    border: none;
  }
  #nav-collapse::-webkit-scrollbar{
      display: none;
  }
  html::-webkit-scrollbar{
      display: none;
  }
  .group-item{
    padding: 0;
    padding-bottom: 5px;
  }
  .channel_list{
    color: #0af;
  }
  .channel_list_item{
    background-color: transparent;
    border-radius: 0;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
    padding-left: 0;
    padding-right: 0;
    box-shadow: 0 0 5px #fff;
  }
  .channel_list_item ul{
    color: #fff;
    opacity: 0.9;
    margin-bottom: -10px;
    margin-top: 10px;

  }
  .sub-list-item{
    position: relative;
    vertical-align: middle;
    padding: 6px 18px;
    padding-left: 48px;
    height: 48px;
    color: #fff;
    border-radius: 0;
    background-color: transparent;
    box-shadow: 0 0 5px #000;
    overflow: hidden;
  }
  .sub-list-item>img{
    position: absolute;
    left: 3px;
    top: 3px;
    width: 42px;
    border-radius: 48px;
  }
  .sub-list-item:hover{
    background-color: #f05;
    box-shadow: 0 0 50px #000;
  }
  .badge-sub{
    position: absolute;
    right: 0;
    top: 6px;
  }
  #private{
    background-color: transparent;
    border-top: 1px solid #fff;
  }
  #private p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
  }
  .newId{
    border-right: 1px solid #a8a8a8;
    position: relative;
  }
  .newId>div{
    padding: 8px 10px;
    line-height: 1.5em;
  }
  .newId input{
    position: absolute;
    right: 0;
    background-color: #a8a8a8;
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    margin-right: 10px;
    margin-left: 40px;
  }
  .newId span{
    line-height: 34px;
  }
  #newId{
    overflow: hidden;
    display: flex;
  }
  #newId .id{
    float: left;
  }
  #newId input{
    border: none;
    display: inline-block;
    border-radius: 5px;
    padding: 5px 20px;
  }
  #newId button{
    display: inline-block;
  }
  #newId button:focus{
    outline: none;
  }
  .action-addFriend{
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 5px;
    border-radius: 5px;
    transform: translate(-50%, -50%);
    border: 1px solid #fff;
    background-color: #fff;
  }
  .action-addFriend *{
    border-radius: 5px;
  }
  .action-addFriend *:focus{
    outline: none;
  }
  /**/
  .unread{
    position: absolute;
    font-size: 10px;
    color: #fff;
    text-shadow: 0 0 3px #fff;
    right: 0;
    margin-right: 5px; 
    padding: 3px;
    border-radius: 14px;
    background-color: #a0a;
  }
  .cover{
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #000;
  }
  /*setting*/
  .hostInfoBtn{
    position: absolute;
    width: 40px;
    bottom: 0;
    left: 15px;
    font-size: 26px;
    color: #aaa;
    z-index: 100;
    transition: all 0.3s;
    cursor: pointer;
  }
  .hostInfoBtn:hover{
    text-shadow: 0 0 10px #111;
  }
  .menu-hide-host{
    position: absolute;
    padding: 5px;
    right: 0;
    bottom: -10px;
    font-size: 26px;
    color: #121212;
    z-index: 100;
    transition: all 0.3s;
    cursor: pointer;
  }
  .menu-hide-host:hover{
    text-shadow: 0 0 10px #aaa;
    box-shadow: 0 0 10px #aaa;
  }
  .hostInfo{
    position: absolute;
    border-right: 1px solid #333;
    z-index: 101;
    left: -100%;
    height: calc(100% - 29px);
    background-color: #383838;
    transition: all 0.5s;
  }
  .na{
    vertical-align: middle;
    min-height: 30%;
    text-align: left;
    color: #fff;
  }
  .na>div{
    position: relative;
  }
  .na>div>img{
    width: 70px;
    height: 70px;
    border-radius: 70px; 
  }
  .na #name{
    display: inline-block;
    font-size: 25px;
    color: #fff;
    width: 100%;
    text-shadow: 0 0 15px #fff;
    padding: 20px 5px;
  }
  .na:hover .modify{
    display: inline-block;
  }
  .na p{
    text-indent: 10px;
    font-family: 'yahei'
  }
  .modify{
    position: absolute;
    display: none;
    padding: 2px 5px;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #333;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #08f;
    transition: all 0.3s;
  }
  .modify:hover{
    color: #fff;
  }
  .host-detail{
    color: #fff;
    border: none;
  }
  .host-detail>li{
    border: none;
    font-family: "yahei";
    border-radius: 0;
    background-color: transparent;
  }
  .noleft{
    left: 0;
  }
  /*弹出设置修改部分*/
  .setting-panel{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #111;
    opacity: 0.5;
  }
  .setting{
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50px;
    left: 50%;
    width: 65%;
    height: 85%;
    color: #fff;
    background-color: #383838;
    transform: translateX(-50%);
  }
  .comfirm:hover{
    color:#fff;
    text-shadow: 0 0 10px #fff;
  }
  .setting>h4{
    font-family: Georgia, serif; 
  }
  .setting-item-name{
    padding: 20px 40px;
    flex: 0 0 auto;
  }
  .setting-item-name>input{
    border: none;
    width: 100%;
    float: left;
    border-bottom: 1px solid #fff;
    padding: 8px 15px;
    padding-right: 60px;
    background-color: transparent;
  }
  #confirm-name{
    border: none;padding: 8px 12px;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin-left: -56px;
  }
  .setting-item-avatar{
    flex: 1 0 auto;
    position: relative;
    padding: 20px 40px;
    padding-top: 0;
    overflow: hidden;
  }
  .setting-item-avatar>div{
    position: absolute;
    left: 200px;
    top: 50px;
  }
  #canvas{
    float: left;
    border: 1px solid #fff;
    background-color: #fff;
  }
  #canvas_sub{
    position: absolute;
    bottom: 0;
    left: -12px;
  }
  /**/
  #avatar{
    -webkit-app-region: no-drag;
  }
  /*avatar-line*/
  .avatar-line{
    width: 72px;
    height: 100%;
    border-right: 1px solid #fff;
    float: left;
  }
  #avatar-first{
    border-bottom: 1px solid #fff;
    margin-bottom: -7.5px;
  }
  .avatar-line-item{
    display: block;
    width: 64px;
    height: 64px;
    margin: 15px auto;
    border-radius: 32px;
  }
  .avatar-line-item:first-child{
    margin-bottom: 7.5px;
  }
  /*member-area*/
  .member-list-banner{
    overflow-y: scroll;
    height: 100%;
    position: relative;
    width: 100%;
  }
  .member-list-banner::-webkit-scrollbar{
    display: none;
  }
  /*addfriend*/
  .aabbccdd{
    position: absolute;
    bottom: 0;
    right: 0;
    display: block;
    width: 30px;
    height: 30px;
    padding: 5px;
    border-radius: 15px;
    background-color: #fff;
  }
  /*message-area*/
  .message-banner{
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .m-ops{
    display: block;
    float: left;
    padding: 4px 10px;
    font-size: 15px;
    margin: 14px 10px;
    line-height: 1em;
    border-radius: 2px;
    background-color: #cc0;
    transition: all 0.3s;
    cursor: pointer;
  }
  .m-ops:hover{
    background-color: #0cc;
  }
  .avatar-banner{
    background-color: #e8e8e8;
    margin-bottom: 3px;
    height: 47px;
  }
  .avatar{
    width:47px; height: 47px; float: right; margin-right: 20px; cursor: pointer;
  }
  .avatar>img{
    width: 41px;
    height: 41px;
    margin-top: 3px;
    border-radius: 50px;
  }
</style>