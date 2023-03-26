<template>
  <view>
    <u-navbar title="在线完成打卡复习"></u-navbar>
    <u-loading-page loading-text="正在加载内容..." :loading="loading"></u-loading-page>
    <view v-if="loading"></view>
    <view v-else-if="!submit.finish">
      <view class="step">
        <text>{{current+1}}</text>
        <text>/</text>
        <text>{{review.length + addition.length}}</text>
      </view>
      <item :key_="k_" :value_="v_" @next="next"></item>
    </view>
    <view v-else>
      <u-button loadingText="正在上传" :loading="submit.submitting" class="s3__btn" @click="submit_" type="primary" plain
        :disabled="loading">完成打卡</u-button>
    </view>
  </view>
</template>

<script>
  import item from "./item.vue"
  export default {
    components: {
      item
    },
    data() {
      return {
        wp_id: '',
        wp: {},
        review: [],
        addition: [],
        submit: {
          submitting: false,
          finish: false,
          review: {},
          addition: {}
        },
        current: 0,
        modal: {
          show: false,
          title: '',
          content: ''
        },
        loading: true,
      }
    },
    async onLoad(option) {
      this.wp_id = option.wp_id
      if (!this.wp_id) {
        uni.showModal({
          title: '参数错误',
          content: '在提交打卡时，我们必须收到一个wp_id，但是您的wp_id为' + this.wp_id + '。\n如有疑问，请将此弹窗截图发送给开发者',
          showCancel: false,
          complete: () => {
            uni.navigateBack()
          }
        })
        console.log(this.wp_id)
      } else {
        await this.fetchData()
        if (this.wp.is_finished) {
          uni.showModal({
            title: '打卡已完成',
            content: '本次打卡已完成',
            showCancel: false,
            complete: () => {
              uni.navigateBack()
            }
          })
        }
      }
    },
    methods: {
      next(known) {
        if (this.current < this.review.length) {
          this.submit.review[this.review[this.current].key] = known
        } else {
          this.submit.addition[this.addition[this.current - this.review.length].key] = known
        }
        this.current++
        if (this.current >= this.review.length + this.addition.length) {
          this.submit.finish = true
        }
      },
      async fetchData() {
        await this.$http.get('/perfection/chIdioms/' + this.wp_id)
          .then(resp => {
            this.wp = resp.data
          })
        await this.$http.get('/perfection/chIdioms/' + this.wp_id + '/review/')
          .then(resp => {
            // console.log(resp)
            this.review = this.$u.randomArray(resp.data.review)
            // console.log(this.review)
          })
        await this.$http.get('/perfection/chIdioms/' + this.wp_id + '/addition/')
          .then(resp => {
            this.addition = resp.data.addition
          })
        this.loading = false
      },
      async submit_() {
        this.submit.submitting = true
        this.$http.post('/perfection/chIdioms/' + this.wp_id + '/finish/', {
          'review': this.submit.review,
          'addition': this.submit.addition,
          'picture': []
        }).then(resp => {
          this.submit.submitting = false
          // uni.navigateBack()
          uni.redirectTo({
            url: '/pages/perfection/chIdioms/chIdioms?wp_id=' + this.wp_id
          })
          // console.log(resp)
        }).catch(error => {
          const data = error.data
          let errors = []
          if (typeof(data) === 'string') {
            errors.push(data)
          } else {
            for (const key in data) {
              errors = errors.concat(data[key])
            }
          }
          this.modal = {
            show: true,
            title: '提交错误',
            content: errors.join('\n')
          }
          this.submit.submitting = false
        })
      },
    },
    computed: {
      key_() {
        if (this.current < this.review.length) {
          return this.review[this.current]
        } else if (this.current < this.review.length + this.addition.length) {
          return this.addition[this.current - this.review.length]
        }
      },
      k_() {
        return this.key_.key
      },
      v_() {
        return this.key_.value
      },
    }
  }
</script>

<style scoped>
  .step{
    font-size: 36rpx;
    text-align: center;
  }
</style>