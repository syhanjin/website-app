<template>
  <view style="height: 100%">
    <text></text>
    <view class="key_">
      <text>{{key_}}</text>
    </view>
    <view class="value_" v-if="showValue">
      <text>{{value_}}</text>
    </view>
    <view class="action">
      <u-row v-if="!wrong">
        <u-col span="6"><u-button @click="click(true)">认识</u-button></u-col>
        <u-col span="6"><u-button @click="click(false)">不认识</u-button></u-col>
      </u-row>
      <u-row v-else>
        <u-col span="12"><u-button @click="click(false)">记住了，下一个</u-button></u-col>
      </u-row>
    </view>
  </view>
</template>

<script>
  export default {
    name: "item",
    props: {
      key_: {
        type: String
      },
      value_: {
        type: String
      }
    },
    data() {
      return {
        showValue: false,
        wrong: false
      }
    },
    methods: {
      click(known) {
        if (known && !this.showValue) {
          this.showValue = true
        } else if (known && this.showValue) {
          this.next(true)
        } else if (!known && !this.showValue) {
          this.showValue = true
          this.wrong = true
        } else if (!known) {
          this.next(false)
        }
      },
      next(known) {
        this.showValue = false
        this.wrong = false
        this.$emit('next', known)
      }
    }
  }
</script>

<style scoped>
  .action {
    position: fixed;
    width: 750rpx;
    left: 0;
    bottom: 50rpx;
  }
  .key_ {
    text-align: center;
    font-size: 96rpx;
    line-height: 96rpx;
    margin: 30rpx 0;
  }

  .value_ {
    text-align: center;
    font-size: 48rpx;
    line-height: 48rpx;
    margin: 30rpx 0;
  }
</style>