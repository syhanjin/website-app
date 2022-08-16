<template>
  <view>
    <u-steps :current="current">
      <u-steps-item title="选择错误的单词"></u-steps-item>
      <u-steps-item title="上传图片"></u-steps-item>
      <u-steps-item title="确认并上传"></u-steps-item>
    </u-steps>
    <u-text v-for="text in texts[current]" type="info" align="center" mode="text" :text="text" :key="text"></u-text>
  </view>
</template>

<script>
  export default {
    props: {
      current: 0
    },
    data() {
      return {
        texts: [
          [
            '选择错误的单词是为了系统更好的生成以后的打卡内容',
            '会有亿点点困难，但是这可以帮助你更有效的记单词',
            '*错误的单词：「打卡版」中您错误的词'
          ],
          [
            '请拍照上传您的打卡内容',
            '*限制：最多3张，每张图片不超过5MB'
          ],
          [
            '请确认以下单词是您在「打卡版」中错误的词'
          ]
        ]
      }
    }
  }
</script>

<style scoped>
  .u-steps {
    margin-bottom: 15px;
  }
</style>
