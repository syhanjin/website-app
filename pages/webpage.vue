<template>
  <view>
    <web-view :src="src"></web-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        src: "http://m.sakuyark.com"
      }
    },
    onLoad(option) {
      this.src = option.src || this.src
    },
    methods: {

    }
  }
</script>

<style>

</style>