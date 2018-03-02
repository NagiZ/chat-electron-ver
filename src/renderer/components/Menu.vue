<template>
  <nav class="menu-actions" id="menu-actions">
    <div style="float: right; margin-right: 5px; height: 100%;">
      <span class="menu-mark" @click="minimize" title="最小化"> <span class="menu-mark-sub menu-minimize"></span> </span>
      <span class="menu-mark" @click="close" title="关闭"> <span class="menu-mark-sub menu-close"></span> </span>
    <!-- <span class="menu-mark"> <span class="menu-mark-sub menu-close"> X </span> </span> -->
    </div>
  </nav>
</template>

<script>
import {ipcRenderer} from 'electron'
export default {
  name: 'Menu',
  data: () => {
    return {}
  },
  methods: {
    minimize: function () {
      ipcRenderer.send('min')
    },
    close: function () {
      ipcRenderer.send('close')
    }
  }
}
</script>

<style scoped>
  .menu-actions{
    width: 100%;
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
    border-radius: 2px;
    padding: 4px;
    margin-top: 4px;
  }
  .menu-close{
    background: url(../assets/close.png) no-repeat;
    background-size: contain;
    padding: 8px;
    margin-top: 2px;
  }
</style>