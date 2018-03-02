<template>
  <div class="full-height flex-col">
    <div class="private-group-name">
      <span>Private Group Name</span>
    </div>
    <div class="private-list-banner">
      <ul class="list-group bg-trans">
        <li class="list-group-item group-item bg-trans ti-sm" v-for="(value, key) in channels" @click="togSlide($event)">{{key}}
          <ul class="list-group">
            <li class="list-group-item sub-list-item font-sm ti-md" v-for="item in value" @click="getIn">{{item}}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'PGCloumn',
  data: () => {
    return {
      channels: {
        '文字频道': ['文频1', '文频2', '文频3', '文频4'],
        '语音频道': ['音频1', '音频2', '音频3', '音频4'],
        '自定频道': ['自频1', '自频2', '自频3', '自频4'],
        '权限x频道': ['权限狗频1', '权限狗频2', '权限狗频3', '权限狗频4']
      }
    }
  },
  methods: {
    togSlide: function (e) {
      $(e.target).children('ul').slideToggle()
    },
    getIn: function () {
      this.$store.dispatch('getInChannel', {obj: this, id: '24'})
    }
  }
}
</script>

<style scoped>
  .full-height{
    height: 100%;
  }
  .bg-trans{
    background: transparent;
  }
  .flex-col{
    display: flex;
    flex-direction: column;
  }
  .font-sm{
    font-size: 13px;
  }
  .ti-md{
    text-indent: 0.3em;
  }
  .ti-sm{
    text-indent: 0.1em;
  }
  .ti-bg{
    text-indent: 0.5em;
  }
  /*common end*/
  .private-group-name{
    padding: 10px 10px;
    text-align: center;
    margin: 15px 0;
  }
  .private-list-banner{
    overflow-y: scroll;
    height: 100%;
    position: relative;
    width: 100%;
  }
  .private-list-banner::-webkit-scrollbar{
    display: none;
  }
  .channel-list-ul{
    position: absolute;
    width: 100%;
  }
  .group-item{
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
</style>