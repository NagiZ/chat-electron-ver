<template>
  <div class="menu-actions">
    <div class="title"><span>Otaku Chat~</span></div>
    <div class="ctrls">
      <span class="ctrls-item" v-for="ctrl in ctrls">{{ctrl}}</span>
    </div>
    <div class="menu-infos">
      <span class="envelope"></span>
      <span>{{getUserInfo.name}}</span>
    </div>
    <div class="menu-actions-window">
      <span class="menu-mark" @click="minimize"> <span class="menu-mark-sub menu-minimize"></span> </span>
      <span class="menu-mark" @click="maximize">
        <span :class="['menu-mark-sub', showm ? 'menu-maximize'  : 'menu-unmaximize']">
          <div v-if="!showm" class="unmaximize"></div>
        </span>
      </span>
      <span class="menu-mark" @click="close"> <span class="menu-mark-sub menu-close"></span> </span>
    </div>
  </div>
  <!-- <div class="container">
    <span class="oi oi-star" title="star"></span>
  </div> -->
</template>

<script>
import {mapGetters} from 'vuex'
import {ipcRenderer} from 'electron'

export default {
  name: 'Menusup',
  data: () => {
    return {
      showm: true,
      ctrls: ['页面', '好友', '帮助']
    }
  },
  methods: {
    maximize: function () {
      ipcRenderer.send('max')
    },
    minimize: function () {
      ipcRenderer.send('min')
    },
    close: function () {
      ipcRenderer.send('close')
    }
  },
  mounted: function () {
    var that = this
    ipcRenderer.on('sMax', (e, tag) => {
      if (tag === 'm') {
        that.showm = true
      } else {
        that.showm = false
      }
    })
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ]),
    gui: function () {
      return this.$store.getters.getInfoById(this.getCurRoomId)
    }
  }
}
</script>

<style scoped>
  /*button in top-menu*/
  .menu-actions{
    background-color: #c8c8c8;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    padding-left: 10px;
    padding-top: 3px;
  }
  .title{
    color: #fff;
    font-weight: bolder;
    flex: 0 1 auto;
  }
  .menu-infos{
    flex: 0 1 auto;
    padding: 0 5px;
    margin-right: 30px;
  }
  .envelope{
    padding: 10px 15px;
    background: url(../assets/envelope.png) no-repeat center;
    background-size: contain;
    transition: all 0.3s;
    margin: 0 30px;
    cursor: pointer;
  }
  .envelope:hover{
    box-shadow: 0 0 5px #a00;
  }
  .menu-actions-window{
    flex: 0 0 auto;
    margin-top: -3px;
    padding: 2.5px 0;
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
  .menu-unmaximize{
    border: 2px solid #333;
    border-radius: 3px;
    padding: 2px;
    margin-top: 4px;
  }
  .unmaximize{
    padding: 2px;
    background-color: #333;
  }
  .menu-close{
    background: url(../assets/close.png) no-repeat;
    background-size: contain;
    background-position: center;
    padding: 8px;
    margin-top: 2px;
  }
  .ctrls{
    margin: 1px 12px;
    margin-left: 40px;
    flex: 1 1 auto;
    display: flex;
  }
  .ctrls-item{
    display: block;
    padding: 0 15px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s;
  }
  .ctrls-item:hover{
    box-shadow: 0 0 50px #a00;
    color: #fff;
  }
</style>