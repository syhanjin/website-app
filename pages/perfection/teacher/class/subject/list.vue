<template>
  <view>
    <u-navbar :title="_option.sn">
      <!-- <navigator slot="right" url="/pages/perfection/words/set_libraries">
        <u-icon name="setting-fill"></u-icon>
      </navigator> -->
    </u-navbar>
    <u-cell-group>
      <u-cell size="large" v-for="(item, index) in list" :key="index" :isLink="true" :url="payload+item.date">
        <text slot="title">{{item.date | dateFormat}}</text>
        <text slot="value"></text>
        <view slot="label" style="font-size: 12px;color: #8d8d8d">
          <text style="margin-right: 5px;">已完成：{{item.finished}}/{{item.total}}</text>
          <text>已检查：{{item.checked}}/{{item.finished}}</text>
        </view>
      </u-cell>
    </u-cell-group>
    <u-loadmore :status="status" />
  </view>
</template>

<script>
  export default {
    data() {
      return {
        page: 1,
        status: "loading",
        list: []
      }
    },
    mixins: [uni.$mixin],
    async onLoad(option) {
      await this.loadPage()
    },
    async onReachBottom() {
      if (this.status == 'nomore') return
      await this.loadPage()
    },
    async onPullDownRefresh() {
      this.status = 'loading'
      this.page = 1
      this.list = []
      await this.loadPage()
      uni.stopPullDownRefresh()
    },
    methods: {
      async loadPage(page) {
        this.page = page || this.page
        await this.$http.get(
          '/perfection/class/' + this._option.class_id + '/subject/' + this._option.subject + '/days?page=' + this.page
        ).then(resp => {
          this.page++
          this.list = this.list.concat(resp.data.results)
          if (!resp.data.next) {
            this.status = 'nomore'
          }
        })
      }
    },
    computed: {
      payload() {
        return '/pages/perfection/teacher/class/subject/subject?data='+JSON.stringify(this._option)+'&date='
      }
    }
  }
</script>

<style>

</style>
