<template>
  <view>
    <u-navbar title="词汇打卡">
      <navigator slot="right" url="/pages/perfection/words/set_libraries">
        <u-icon name="setting-fill"></u-icon>
      </navigator>
    </u-navbar>
    <u-cell-group>
      <u-cell v-for="item in list" :key="item.id" :isLink="true" :url="payload+item.id">
        <text slot="title">{{item.created|dateFormat}}</text>
        <!-- <view slot="value" v-if="item.is_finished">
          <u-text mode="text" type="success" v-if="item.acc>=0.9" :text="'优秀('+item.acc_str+')'"></u-text>
          <u-text mode="text" type="warning" v-else-if="item.acc>=0.7" :text="'合格('+item.acc_str+')'"></u-text>
          <u-text mode="text" type="error" v-else :text="'不合格('+item.acc_str+')'"></u-text>
        </view> -->
        <view slot="value" style="display: flex;">
          <view class="tag" v-if="item.is_finished">
            <u-tag type="success" v-if="item.acc>=0.9" :text="'优秀('+percentage(item.acc)+')'" plain size="mini"></u-tag>
            <u-tag type="warning" v-else-if="item.acc>=0.7" :text="'合格('+percentage(item.acc)+')'" plain size="mini"></u-tag>
            <u-tag type="error" v-else :text="'不合格('+percentage(item.acc)+')'" plain size="mini"></u-tag>
          </view>
          <u-tag class="tag" v-else text="未完成" size="mini" type="error"></u-tag>
          <view class="tag tag-rating" v-if="item.is_checked">
            <u-tag v-if="item.rating=='pass'" text="Pass" plain size="mini" type="success"></u-tag>
            <u-tag v-else text="Fail" plain size="mini" type="error"></u-tag>
          </view>
          <view class="tag tag-rating" v-else-if="item.is_finished">
            <u-tag text="未检查" plain plainFill size="mini" type="error"></u-tag>
          </view>
        </view>
        <!-- <view slot="value" v-else>
          <u-text mode="text" type="info" text="未完成"></u-text>
        </view> -->
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
      percentage(acc){
        return (acc * 100).toFixed(2) + '%'
      },
      async loadPage(page) {
        this.page = page || this.page
        await this.$http.get('/perfection/words/?page=' + this.page)
          .then(resp => {
            this.page++
            this.list = this.list.concat(resp.data.results)
            if (!resp.data.next) {
              this.status = 'nomore'
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
