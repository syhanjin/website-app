<template>
  <view>
    <u-navbar :autoBack="true" :fixed="false">
      <text slot="center">词汇打卡</text>
      <view slot="left">
        <i class="uicon-arrow-left" />
      </view>
      <navigator slot="right" url="/pages/perfection/words/set_libraries">
        <u-icon name="setting-fill"></u-icon>
      </navigator>
    </u-navbar>
    <u-cell-group>
      <u-cell v-for="words in list" :key="words.id" :isLink="true" :url="payload+words.id">
        <text slot="title">{{words.created|dateFormat}}</text>
        <view slot="value" v-if="words.is_finished">
          <u-text mode="text" type="success" v-if="words.acc>=0.9" :text="'优秀('+words.acc_str+')'"></u-text>
          <u-text mode="text" type="warning" v-else-if="words.acc>=0.7" :text="'合格('+words.acc_str+')'"></u-text>
          <u-text mode="text" type="error" v-else :text="'不合格('+words.acc_str+')'"></u-text>
          <!-- <u-text mode="text" type="success" v-if="words.is_finished" text=""></u-text> -->
        </view>
        <view slot="value" v-else>
          <u-text mode="text" type="info" text="未完成"></u-text>
        </view>
      </u-cell>
    </u-cell-group>
    <u-loadmore :status="status" />
  </view>
</template>

<script>
  import {
    hasPerfection
  } from '@/utils/auth.js'
  import {
    getCurrentPageUrl
  } from '@/utils/pages.js'
  export default {
    data() {
      return {
        status: 'loading',
        page: 1,
        list: [],
        payload: '/pages/perfection/words/words?wp_id='
      }
    },
    onLoad() {
      hasPerfection(uni, this.$store, getCurrentPageUrl())
      this.loadPage()
    },
    onReachBottom() {
      if (this.status == 'nomore') return
      this.loadPage()
    },
    async onPullDownRefresh() {
      this.status = 'loading'
      this.page = 1
      this.list = []
      this.loadPage()
      await uni.stopPullDownRefresh()
    },
    methods: {
      async loadPage(page) {
        this.page = page || this.page
        await this.$http.get('/perfection/words/?page=' + this.page)
          .then(resp => {
            this.page++
            this.list = this.list.concat(resp.results)
            if (!resp.next) {
              this.status = 'nomore'
            }
          })
      }
    }
  }
</script>

<style>

</style>
