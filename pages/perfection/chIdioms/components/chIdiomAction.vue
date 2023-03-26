<template>
  <u-sticky>
    <u-row class="remember-row">
      <u-col :span="6">
        <u-button @click="$emit('hide-all')">全部隐藏释义</u-button>
      </u-col>
      <u-col :span="6">
        <u-button @click="$emit('shuffle')">随机排序成语</u-button>
      </u-col>
    </u-row>
  </u-sticky>
</template>

<script>
  export default {
    name: "wordAction",
    props: {
    }
  }
</script>

<style>
</style>
