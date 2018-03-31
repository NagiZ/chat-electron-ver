<template>
    <div class="index pr">
        <div class="list-box">
          <div class="w-100 row no-gutters">
            <span class="oi oi-grid-three-up cp menu"></span>
            <div class="search col">
              <input id="search" placeholder="Search" class="t" />
            </div>
          </div>
          <div class="channel-box cp t"  v-for="input in [1,2,3,4,5]">
            <div class="w-100 row no-gutters">
              <div class="avatar pr"><img class="img-fluid" src="../assets/pic/avatar.jpg" /></div>
              <div class="detail col pr">
                <div class="name"><span class="oi oi-people channelType"></span>xxxxxxxxxxxxxxxxxxxxxxxxxx</div>
                <div class="message hasMessage">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
                <em class="date pa">07.12.01</em>
                <em class="message-count pa">55</em>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import 'open-iconic/font/css/open-iconic-bootstrap.min.css'
export default {
  name: 'index',
  data () {
    return {}
  },
  methods: {
  }
}
</script>
<style scoped>
    .index{
        width: 300px;
        min-height: 500px;
        max-height: 100%;
        overflow: hidden;
        box-shadow: 0 0 5px #ccc inset
    }
    .menu{
      padding: 20px;
      padding-right: 0
    }
    .search{
      padding: 13px
    }
    .search input{
      outline: 0;
      width: 100%;
      padding:6px 10px;
      border: 1px solid #ccc;
      background-color: #f0f0f0;
      font-size: 0.8em;
      color:#333

    }
    .search input:focus{
      border: 1px solid #5bb2c5;
      background-color: #fff
    }
    .channelType{
      font-size: .8em;
      padding-right:2px
    }
    .channel-box:hover{
      background-color:#f0f0f0
    }
    .channel-box .avatar{
      width:80px;
      padding:10px 15px;
    }
    .channel-box .avatar img{
      width:50px;
      border-radius:50%;
    }
    .channel-box .detail{
      padding:10px 0px;
      max-width:  calc(100% - 80px)
    }
    .channel-box .name{
      font-size: 1em;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding-bottom:5px;
      max-width:  calc(100% - 70px)
    }
    .channel-box .message{
      color: #ccc;
      font-size: 0.8em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width:  calc(100% - 15px)
    }
    .channel-box .message.hasMessage{
      max-width:  calc(100% - 35px)
    }
    .channel-box .date{
      font-size:0.8em;
      font-style: normal;
      color: #bbb;
      right:15px;
      top:15px;
    }
    .channel-box .message-count{
      font-size:0.6em;
      font-style: normal;
      color: #fff;
      right:15px;
      bottom:13px;
      background-color:#bbb;
      text-align:center;
      width:17px;
      height:17px;
      border-radius:50%
    }
</style>
