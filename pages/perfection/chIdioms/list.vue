<template>
  <view>
    <u-navbar title="成语打卡">
      <navigator slot="right" url="/pages/perfection/chIdioms/set_libraries">
        <u-icon name="setting-fill"></u-icon>
      </navigator>
    </u-navbar>
    <u-cell-group>
      <u-cell v-for="item in list" :key="item.id" :isLink="true" :url="payload+item.id">
        <text slot="title">{{item.updated|dateFormat}}</text>
        <view slot="value" style="display: flex;">
          <view class="tag" v-if="item.status == 'finished'">
            <u-tag type="success" v-if="item.acc>=0.9" :text="'优秀('+percentage(item.acc)+')'" plain size="mini"></u-tag>
            <u-tag type="warning" v-else-if="item.acc>=0.7" :text="'合格('+percentage(item.acc)+')'" plain size="mini">
            </u-tag>
            <u-tag type="error" v-else :text="'不合格('+percentage(item.acc)+')'" plain size="mini"></u-tag>
          </view>
          <u-tag class="tag" v-else text="未完成" size="mini" type="error"></u-tag>
        </view>
      </u-cell>
    </u-cell-group>
    <u-loadmore :status="status" @loadmore="loadPage" />
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
        payload: '/pages/perfection/chIdioms/chIdioms?wp_id='
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
      percentage(acc) {
        return (acc * 100).toFixed(2) + '%'
      },
      async loadPage(page) {
        this.status = 'loading'
        this.page = page || this.page
        await this.$http.get('/perfection/chIdioms/?page=' + this.page)
          .then(resp => {
            this.page++
            this.list = this.list.concat(resp.data.results)
            if (!resp.data.next) {
              this.status = 'nomore'
            } else {
              this.status = 'loadmore'
            }
          })
      }
    }
  }
</script>

<style scoped>
  .tag {
    margin: 2px;
  }

  .tag-rating>>>.u-tag {
    width: 3.3em;
  }

  .tag-rating>>>.u-tag .u-tag__text {
    flex: 1;
    text-align: center;
  }
</style>
