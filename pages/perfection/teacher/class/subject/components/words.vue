<template>
  <view>
    <u-text align="center" text="「记忆版」单词" />
    <view class="word-box">
      <text v-for="item in obj.remember" :key="item.word">{{item.word}}</text>
      <text v-for="i in (obj.remember.length%3)?(3-obj.remember.length%3):0" :key="i" disabled></text>
    </view>
    <u-text align="center" text="「打卡版」单词" />
    <view class="word-box">
      <text v-for="item in obj.review" :key="item.word">{{item.word}}</text>
      <text v-for="i in (obj.review.length%3)?(3-obj.review.length%3):0" :key="i" disabled></text>
    </view>
    <template v-if="obj.is_finished">
      <u-text align="center" text="本次遗忘单词" />
      <view class="word-box">
        <text v-for="item in obj.unremembered" :key="item.word">{{item.word}}</text>
        <text v-for="i in (obj.unremembered.length%3)?(3-obj.unremembered.length%3):0" :key="i" disabled></text>
      </view>
    </template>
  </view>
</template>

<script>
  export default {
    props: {
      obj: {}
    }
  }
</script>

<style scoped>
  .word-box {
    margin-bottom: 15px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }

  .word-box>text {
    width: 32vw;
    padding: 1vw;
    text-align: center;
    background-color: #fff;
    margin-bottom: 5px;
  }
</style>
