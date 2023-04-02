<template>
  <view>
    <u-status-bar></u-status-bar>
    <view class="place">

    </view>
    <template v-if="$store.state.me.perfection&&$store.state.me.perfection.role=='student'">
      <!-- 学生端部分 -->
      <!-- <view class="warnings">
        <u-alert type="error" effect="dark" :center="true" title="有欠下的单词打卡" @click="toPage(list[1].path)"
          v-if="$store.state.perfection.has_missed_words_perfection" />
        <u-alert type="warning" effect="dark" :center="true" title="有未完成的单词打卡" @click="toPage(list[1].path)"
          v-else-if="$store.state.perfection.has_unfinished_words_perfection" />
      </view> -->
      <u-grid :border="true">
        <u-grid-item v-for="(item, index) in list" :key="index" @click="toPage(item.path)">
          <u-icon :customStyle="{paddingTop:20+'rpx'}" :name="item.name" :size="22"></u-icon>
          <text class="grid-text">{{item.title}}</text>
        </u-grid-item>
      </u-grid>
    </template>
    <template v-else-if="$store.state.isAuthenticated">
      <u-text mode="text" type="error" text="您未开通打卡系统，该功能无法使用" align="center"></u-text>
      <u-button text="点击前往开通" @click="toCreate"></u-button>
    </template>
    <template v-else>
      <text>请先登录</text>
    </template>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: [{
            name: 'file-text',
            title: '单词打卡',
            path: '/pages/perfection/words/list'
          },{
            name: 'file-text',
            title: '成语打卡',
            path: '/pages/perfection/chIdioms/list'
          },
          {
            name: 'info-circle',
            title: '打卡系统说明',
            path: '/pages/webpage?src=http://docs.sakuyark.com/perfection/'
          }
        ]
      }
    },
    onLoad() {
      // hasPerfection(uni, this.$store, getCurrentPageUrl())
    },
    onPullDownRefresh() {
      uni.$once('data-fetched', uni.stopPullDownRefresh)
      uni.$emit('fetch-data')
    },
    methods: {
      toPage(path) {
        uni.navigateTo({
          url: path
        })
      },
      toCreate() {
        uni.redirectTo({
          url: "/pages/perfection/create?redirect=/pages/perfection/perfection",
        })
      }
    }
  }
</script>

<style scoped>
  .place {
    height: 10vh;
  }

  .warnings {
    width: 90vw;
    margin: 15px auto;
  }

  .grid-text {
    font-size: 14px;
    color: #909399;
    padding: 10rpx 0 20rpx 0rpx;
    /* #ifndef APP-PLUS */
    box-sizing: border-box;
    /* #endif */
  }
</style>
