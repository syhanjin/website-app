<template>
  <view class="container">
    <u-status-bar></u-status-bar>
    <view>
      <web-view src="http://static.sakuyark.com/md/perfection/home.html"></web-view>
    </view>
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        content: ''
      }
    }, 
    async onLoad() {
    },
    methods: {
    }
  }
</script>

<style>
  .container {
    padding: 20px;
    font-size: 14px;
    line-height: 24px;
  }
</style>
