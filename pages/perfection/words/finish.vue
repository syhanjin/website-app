<template>
  <view>
    <u-navbar :autoBack="true" :fixed="false">
      <text slot="center">词汇打卡上传{{wp.created || '' | dateFormat}}</text>
      <view slot="left">
        <i class="uicon-arrow-left" />
      </view>
    </u-navbar>
    <u-modal :show="modal.show" :title="modal.title" :content='modal.content' @confirm="modal.show=false"></u-modal>
    <view class="step">
      <finish-steps :current="0" />
      <view class="word-box">
        <u-button class="s1__word" v-for="(v, k, i) in review" :key="k" @click="$set(review, k, !v)"
          :type="v?'info':'primary'">{{k}}</u-button>
        <u-button class="s1__word" v-for="i in fix" :key="i" disabled></u-button>
      </view>
    </view>
    <view class="step">
      <finish-steps :current="1" />
      <view class="s2__picture">
        <u-upload width="80vw" height="80vw" :fileList="picture.fileList" :previewFullImage="true" :maxCount="3"
          @afterRead="pictureAfterRead" @delete="pictureDelete" uploadText="上传打卡图片" multiple :maxSize="5242880">
          </icon>
        </u-upload>
      </view>
    </view>
    <view class="step">
      <finish-steps :current="2" />
      <view class="s3__words" v-if="wrongCount > 0">
        <text v-for="(v, k, i) in review" v-if="!v" :key="k">{{k}}</text>
      </view>
      <view class="s3__words" v-else>无</view>
      <!-- <view class="s3__submitting" v-if="submit.submitting">
        <u-line-progress :percentage="submit.percentage" activeColor="#ff0000"></u-line-progress>
      </view> -->
      <u-button loadingText="正在上传" :loading="submit.submitting" class="s3__btn" @click="submit_" type="primary" plain>
        完成打卡</u-button>
    </view>
  </view>
</template>

<script>
  import finishSteps from './finishSteps.vue'
  import {
    pathToBase64
  } from '@/js_sdk/mmmm-image-tools'
  export default {
    components: {
      finishSteps
    },
    data() {
      return {
        wp_id: '',
        wp: {},
        review: {},
        fix: 0,
        picture: {
          fileList: [],
        },
        submit: {
          submitting: false
        },
        modal: {
          show: false,
          title: '',
          content: ''
        }
      }
    },
    async onLoad(option) {
      this.wp_id = option.wp_id
      if (!this.wp_id) {
        uni.showModal({
          title: '参数错误',
          content: '在提交打卡时，我们必须收到一个wp_id，但是您的wp_id为'+this.wp_id+'。\n如有疑问，请将此弹窗截图发送给开发者',
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
      pictureDelete(event) {
        this.picture.fileList.splice(event.index, 1)
      },
      async load_picture() {
        return await Promise.all(
          this.picture.fileList.map(item => {
            return pathToBase64(item.url)
          }))
      },
      async submit_() {
        if (this.picture.fileList.length == 0) {
          this.modal.show = true
          this.modal.title = '必须选择图片'
          this.modal.content = '您至少要选择一张打卡内容的图片'
          return
        }
        this.submit.submitting = true
        let picture = await this.load_picture()
        this.$http.post('/perfection/words/' + this.wp_id + '/finish/', {
          'review': this.review,
          'picture': picture
        }).then(resp => {
          this.submit.submitting = false
          // uni.navigateBack()
          uni.redirectTo({
            url: '/pages/perfection/words/words?wp_id=' + this.wp_id
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
        })
      },
      async pictureAfterRead(event) {
        let lists = [].concat(event.file)
        lists.map((item) => {
          this.picture.fileList.push(item)
        })
        // console.log(await this.load_picture())
      },
      async fetchData() {
        await this.$http.get('/perfection/words/' + this.wp_id)
          .then(resp => {
            this.wp = resp
          })
        this.$http.get('/perfection/words/' + this.wp_id + '/review/?simple=true')
          .then(resp => {
            resp.review.map(value => {
              this.$set(this.review, value, true)
            })
            const mod = resp.review.length % 3
            this.fix = mod ? (3 - mod) : 0
          })
      }
    },
    computed: {
      wrongCount() {
        let count = 0
        for (let k in this.review) {
          if (!this.review[k]) count++
        }
        return count
      }
    }
  }
</script>

<style scoped>
  .step {
    background-color: #fff;
    padding: 15px 0;
    margin-bottom: 15px;
  }

  .word-box {
    margin: 15px 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }

  .s1__word {
    font-family: Consolas;
    display: inline-flex;
    align-items: center;
    margin-bottom: 5px;
    width: 30%;
    font-size: 16px;
  }

  .s2__picture {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 10vw;
  }

  .s2__picture>.u-upload>>>.u-upload__wrap>.u-upload__wrap__preview {
    margin-right: 0;
  }

  .s3__words {
    display: flex;
    flex-flow: row wrap;
    margin: 5px 10vw;
    color: #3e3e3e;
  }

  .s3__words>text {
    width: 33%
  }

  .s3__btn {
    width: 90vw;
  }
</style>
