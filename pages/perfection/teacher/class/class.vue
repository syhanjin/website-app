<template>
  <view>
    <u-navbar>
      <view slot="center">
        <text>{{class_.name}}</text>
        <text style="color: #8d8d8d;">({{class_.students}})</text>
      </view>
    </u-navbar>
    <view class="subject">
      <u-grid :border="true">
        <u-grid-item v-for="(item, index) in class_.subject" :key="index" @click="toSubject(item)">
          <u-icon :customStyle="{paddingTop:20+'rpx'}" :name="subjectId2IconName[item.id]" :size="22"></u-icon>
          <text class="grid-text">{{item.name}}</text>
        </u-grid-item>
      </u-grid>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        id: '',
        class_: {},
        subjectId2IconName: {
          "words": "file-text"
        }
      }
    },
    async onLoad(option) {
      this.id = option.id
      if (!this.id) {
        console.log(this.id)
      } else {
        await this.fetchData()
      }
    },
    methods: {
      async fetchData() {
        await this.$http.get('/perfection/class/' + this.id)
          .then(resp => {
            this.class_ = resp.data
            // console.log(this.class_)
          })
        this.loading = false
      },
      toSubject(subject) {
        uni.navigateTo({
          url: '/pages/perfection/teacher/class/subject/list?class_id=' + this.id +
            '&subject=' + subject.id +
            '&sn=' + subject.name // 这个主要是数据的传递有点麻烦
        })
      }
    }
  }
</script>

<style scoped>
  .grid-text {
    font-size: 14px;
    color: #909399;
    padding: 10rpx 0 20rpx 0rpx;
    /* #ifndef APP-PLUS */
    box-sizing: border-box;
    /* #endif */
  }
</style>
