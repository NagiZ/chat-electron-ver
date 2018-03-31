<template>
  <span class="back" @click="back"></span>
</template>

<script>
export default {
  name: 'Back',
  data: () => {
    return {}
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .back{
    width: 20px;
    height: 20px;
    background: url(../../assets/back.png) no-repeat;
    background-size: contain;
    transition: all 0.3s;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #a2a2a2;
  }
  .back:hover{
    box-shadow: 0 0 10px #35a;
  }
</style>
