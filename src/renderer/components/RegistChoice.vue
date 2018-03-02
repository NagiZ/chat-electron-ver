<template>
  <div class="regist">
    <back></back>
    <menu-action></menu-action>
    <div class="regist-type">
      <p>注册/Regist</p>
      <!-- <div>以Steam</div>
      <div>以手机</div>
      <div>以邮箱</div> -->
      <ul class="types">
        <li v-for="type in types" class="type" @click="startRegist(type)"><span>{{type}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import menuAction from '@/components/Menu.vue'
import back from '@/components/Back.vue'
import {ipcRenderer} from 'electron'

export default {
  name: 'RegistChoice',
  components: {menuAction, back},
  data: () => {
    return {
      types: ['以Steam', '以手机', '以邮箱']
    }
  },
  methods: {
    startRegist: function (t) {
      this.$router.push('/register/' + t)
    }
  },
  created: function () {
    ipcRenderer.send('resizable', 0)
  }
}
</script>

<style scoped>
  .regist{
    width: 100%;
    height: 100%;
    -webkit-app-region: no-drag;
  }
  .regist-type{
    width: 200px;
    height: 260px;
    margin: 0 auto;
    margin-top: 60px;
    border: 1px solid #e8e8e8;
    padding: 10px 0;
  }
  .regist-type>p{
    text-align: center;
    background: linear-gradient(90deg, #fff, #ccc 40%, #fff);
    padding: 2px;
    padding-bottom: 2px;
    cursor: pointer;
  }
  .types{
    list-style: none;
    font: 15px bolder sans-serif;
    padding: 5px;
  }
  .type{
    padding: 10px 20px;
    margin: 15px 20px;
    text-indent: 2em;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .type:hover{
    background-color: #ff5;
    cursor: pointer;
  }
</style>