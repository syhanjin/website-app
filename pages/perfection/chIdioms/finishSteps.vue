<template>
  <view>
    <u-steps :current="current">
      <u-steps-item title="选择错误的成语"></u-steps-item>
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
            '选择错误的成语是为了系统更好的生成以后的打卡内容',
            '为了加入搜索框，舍弃了一点点样式，请不要在意',
            '*错误的成语：「打卡版」中您不清楚意思或理解错误的成语'
          ],
          [
            '请拍照上传您的打卡内容',
            '*限制：最多3张，每张图片不超过5MB'
          ],
          [
            '请确认以下是您在「打卡版」中您不清楚意思或理解错误的成语'
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
