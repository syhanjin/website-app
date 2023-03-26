<template>
  <view>
    <u-navbar>
      <text slot="center">成语打卡{{wp.updated || '' | dateFormat}}</text>
    </u-navbar>
    <u-skeleton rows="25" :loading="loading"
      :rowsHeight="[75, 30, 60, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45]"
      :title="false">
      <view v-if="!is_finished">
        <view class="header">
          <u-button type="primary" plain @click="goFinish">前往上传打卡内容</u-button>
          <u-button type="primary" plain @click="goFinishLive">在线完成打卡内容</u-button>
        </view>
        <view class="downloads">
          <text class="title">下载文档</text>
          <text>由于「打卡版」每次会随机排序，所以尽可能打印下来再写</text>
          <u-row>
            <u-col :span="5.75">
              <u-button @click="download('remember')">下载「记忆版」</u-button>
            </u-col>
            <u-col :span="0.5"></u-col>
            <u-col :span="5.75">
              <u-button @click="download('review')">下载「打卡版」</u-button>
            </u-col>
          </u-row>
        </view>
        <view class="remember-box" v-if="word_list.length">
          <chIdiomAction @hide-all="hideAll" @shuffle="shuffle"/>
          <view class="remember-row" @click="wordClick(index)" v-for="(word, index) in word_list" :key="word.word">
            <view class="remember__left" :class="{'right-hidden': word.rightHidden}">
              <text class="cell word">{{word.key}}</text>
              <text class="cell symbol"></text>
            </view>
            <view class="remember__right" v-if="!word.rightHidden">
              <text class="cell chinese">{{word.value}}</text>
            </view>
          </view>
        </view>
        <view v-else>
          <u-text align="center" type="info" text="今天没有需要记的单词"></u-text>
        </view>
      </view>
      <view v-else>
        <view class="header">
          <u-button type="primary" plain disabled>该打卡已完成</u-button>
        </view>
        <view class="downloads">
          <text class="title">下载文档</text>
          <u-row>
            <u-col :span="5.75">
              <u-button @click="download('remember')">下载「记忆版」</u-button>
            </u-col>
            <u-col :span="0.5"></u-col>
            <u-col :span="5.75">
              <u-button @click="download('review')">下载「打卡版」</u-button>
            </u-col>
          </u-row>
        </view>
        <view>
          <u-image v-for="img in wp.picture" :key="img.id" :src="img.url" width="100vw" mode="widthFix" height="auto">
          </u-image>
        </view>
        <view class="remember-box">
          <u-row class="remember-row">
            <u-text mode="text" align="center" text="以下是本次错误的单词"></u-text>
          </u-row>
          <chIdiomAction @hide-all="hideAll" @shuffle="shuffle"/>
          <view class="remember-row" @click="wordClick(index)" v-for="(word, index) in word_list" :key="word.word">
            <view class="remember__left" :class="{'right-hidden': word.rightHidden}">
              <text class="cell word">{{word.key}}</text>
              <text class="cell symbol"></text>
            </view>
            <view class="remember__right" v-if="!word.rightHidden">
              <text class="cell chinese">{{word.value}}</text>
            </view>
          </view>
        </view>
      </view>
    </u-skeleton>
  </view>
</template>

<script>
  import Vue from 'vue'
  import {
    baseURL
  } from '@/request.js'
  import moment from '@/node_modules/moment'
  import chIdiomAction from './components/chIdiomAction.vue'
  export default {
    data() {
      return {
        loading: true,
        wp_id: '',
        word_list: [],
        wp: {}
      }
    },
    components: {chIdiomAction},
    async onLoad(option) {
      this.wp_id = option.wp_id
      if (!this.wp_id) {
        console.log(this.wp_id)
      } else {
        await this.fetchData()
      }
    },
    methods: {
      async fetchData() {
        await this.$http.get('/perfection/chIdioms/' + this.wp_id)
          .then(resp => {
            this.wp = resp.data
          })
        if (this.is_finished) {
          await this.$http.get('/perfection/chIdioms/' + this.wp_id + '/unremembered/')
            .then(resp => {
              this.word_list = resp.data.unremembered
            })
        } else {
          await this.$http.get('/perfection/chIdioms/' + this.wp_id + '/remember/')
            .then(resp => {
              this.word_list = resp.data.remember
            })
        }
        this.loading = false
      },
      goFinish() {
        // 不要在意名字
        uni.navigateTo({
          url: '/pages/perfection/chIdioms/finish?wp_id=' + this.wp_id
        })
      },
      goFinishLive(){
        uni.navigateTo({
          url: '/pages/perfection/chIdioms/finishLive/finishLive?wp_id=' + this.wp_id
        })
      },
      wordClick(index) {
        // this.remember[index].rightHidden = !this.remember[index].rightHidden
        let word = this.word_list[index]
        word.rightHidden = !word.rightHidden
        this.$set(this.word_list, index, word)
      },
      hideAll() {
        this.word_list.forEach((item, index, arr) => {
          item.rightHidden = true;
          this.$set(arr, index, item)
        })
      },
      shuffle() {
        this.word_list = uni.$u.randomArray(this.word_list)
        // for (var j, x, i = this.word_list.length; i; j = parseInt(Math.random() * i), x = this.word_list[--i], this
        //   .word_list[i] = this.word_list[j], this.word_list[j] = x);
        // this.$forceUpdate()
      },
      download(type) {
        const url = baseURL + '/perfection/chIdioms/' + this.wp_id + '/' + type + '_file/';
        const header = {
          Authorization: 'Token ' + this.$store.state.token
        }
        // 请求封装兼容性问题
        // #ifdef APP-PLUS
        uni.showLoading({
          title: `下载中...`
        });
        let downloadTask = uni.downloadFile({
          url: url,
          header: header,
          success: (res) => {
            if (res.statusCode === 200) {
              uni.saveFile({
                tempFilePath: res.tempFilePath,
                success: (res) => {
                  uni.hideLoading()
                  uni.openDocument({
                    filePath: res.savedFilePath
                  })
                }
              })
            }
          }
        })
        downloadTask.onProgressUpdate((res) => {
          uni.showLoading({
            title: `下载中(${res.progress}%)`
          });
        })
        //#endif
        //#ifdef H5
        uni.showToast({
          title: '由于特殊原因，文档暂无法从H5端下载（其实是因为下载文档需要验证，但是浏览器做不到）',
          icon: 'none',
          duration: 1500
        })
        setTimeout(() => {
          uni.showLoading({
            title: `下载中...`
          });
          let downloadTask = uni.downloadFile({
            url: url,
            header: header,
            success: (res) => {
              if (res.statusCode === 200) {
                let eleLink = document.createElement('a')
                eleLink.style.display = 'none'
                eleLink.href = res.tempFilePath
                eleLink.target = '_Blank'
                eleLink.click()
                URL.revokeObjectURL(eleLink.href)
                uni.hideLoading()
              }
            }
          })
          downloadTask.onProgressUpdate((res) => {
            uni.showLoading({
              title: `下载中(${res.progress}%)`
            });
          })
        }, 1500)
        //#endif
      }
    },
    computed: {
      is_finished() {
        return this.wp.status == 'finished'
      }
    }
  }
</script>

<style>
  @font-face {
    font-family: 'Lingoes Unicode';
    src: url(@/static/fonts/lingoes.ttf);
  }

  .header {
    margin: 15px;
  }

  .date {
    text-align: center;
    color: gray;
  }

  .title {
    width: 100%;
    display: block;
    text-align: center;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .u-skeleton>>>view>.downloads {
    border-top: 2px solid #bbbbbb;
    border-bottom: 2px solid #bbbbbb;
    margin: 15px 0;
    padding: 15px;
  }

  .remember-box {
    font-family: 'Consolas';
  }

  .remember-row {
    height: 8vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #bbbbbb;
    padding: 0 3vw;
  }

  .remember__left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1vh;
  }

  .remember__left.right-hidden {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .remember__left.right-hidden>.word {
    flex: 1;
  }

  .remember__left.right-hidden>.symbol {
    flex: 1.2;
    font-size: 16px;
  }


  .remember__right {
    flex: 1.2;
  }

  .word {
    font-size: 16px;
  }

  .symbol {
    font-family: 'Lingoes Unicode';
    font-size: 10px;
    line-height: 12px;
  }
</style>
