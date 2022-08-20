<template>
  <view>
    <u-navbar title="班级">
      <navigator slot="right" url="/pages/perfection/teacher/class/create">
        <u-icon name="plus"></u-icon>
      </navigator>
    </u-navbar>
    <u-cell-group>
      <u-cell size="large" v-for="class_ in list" :key="class_.id" :isLink="true" :url="payload+class_.id">
        <view slot="title">
          <text>{{class_.name}}</text>
          <text style="color: #8d8d8d;">({{class_.students}})</text>
        </view>
        <text slot="value"></text>
        <view slot="label" style="font-size: 12px;color: #8d8d8d">{{class_.id}}</view>
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
        page: 1,
        payload: "/pages/perfection/teacher/class/class?id=",
        status: "loading",
        list: []
      }
    },
    async onLoad() {
      hasPerfection(uni, this.$store, getCurrentPageUrl())
      await this.loadPage()
      uni.$off('perfection-class-refresh')
      uni.$on('perfection-class-refresh', this.refresh)
    },
    async onReachBottom() {
      if (this.status == 'nomore') return
      await this.loadPage()
    },
    async onPullDownRefresh() {
      await this.refresh()
      uni.stopPullDownRefresh()
    },
    methods: {
      async loadPage(page) {
        this.page = page || this.page
        await this.$http.get('/perfection/class/?page=' + this.page)
          .then(resp => {
            this.page++
            this.list = this.list.concat(resp.data.results)
            if (!resp.data.next) {
              this.status = 'nomore'
            }
          })
      },
      async refresh() {
        this.status = 'loading'
        this.page = 1
        this.list = []
        await this.loadPage()
      }
    }
  }
</script>

<style>

</style>
