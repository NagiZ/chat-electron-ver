<template>
  <nav class="menu-actions" id="menu-actions">
    <div style="float: right; margin-right: 5px; height: 100%;">
      <span class="menu-mark" @click="minimize" title="最小化"> <span class="menu-mark-sub menu-minimize"></span> </span>
      <span class="menu-mark" @click="close" title="关闭"> <span class="menu-mark-sub menu-close"></span> </span>
    </div>
  </nav>
</template>

<script>
import {ipcRenderer} from 'electron'
import '@/assets/css/common-style.css'
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
      console.log('dd')
      ipcRenderer.send('close')
    }
  }
}
</script>

<style scoped>
  .menu-actions{
    width: 100%;
    height: 20px;
    overflow: hidden;
  }
</style>