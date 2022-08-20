<template>
  <view>
    <u-grid :border="true">
      <u-grid-item v-for="(item, index) in list" :key="index" @click="toPage(item.path)">
        <u-icon :customStyle="{paddingTop:20+'rpx'}" :name="item.name" :size="22"></u-icon>
        <text class="grid-text">{{item.title}}</text>
      </u-grid-item>
    </u-grid>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: [{
          name: 'list-dot',
          title: '班级',
          path: '/pages/perfection/teacher/class/list'
        }]
      }
    },
    methods: {
      toPage(path) {
        uni.navigateTo({
          url: path
        })
      }
    }
  }
</script>

<style>

</style>
